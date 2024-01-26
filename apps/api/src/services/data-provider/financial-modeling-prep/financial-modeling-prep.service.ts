import { LookupItem } from '@portfoolio/api/app/symbol/interfaces/lookup-item.interface';
import { ConfigurationService } from '@portfoolio/api/services/configuration/configuration.service';
import {
  DataProviderInterface,
  GetDividendsParams,
  GetHistoricalParams,
  GetQuotesParams,
  GetSearchParams
} from '@portfoolio/api/services/data-provider/interfaces/data-provider.interface';
import {
  IDataProviderHistoricalResponse,
  IDataProviderResponse
} from '@portfoolio/api/services/interfaces/interfaces';
import { DEFAULT_CURRENCY } from '@portfoolio/common/config';
import { DATE_FORMAT, parseDate } from '@portfoolio/common/helper';
import { DataProviderInfo } from '@portfoolio/common/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, SymbolProfile } from '@prisma/client';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
import got from 'got';

@Injectable()
export class FinancialModelingPrepService implements DataProviderInterface {
  private apiKey: string;
  private readonly URL = 'https://financialmodelingprep.com/api/v3';

  public constructor(
    private readonly configurationService: ConfigurationService
  ) {
    this.apiKey = this.configurationService.get(
      'FINANCIAL_MODELING_PREP_API_KEY'
    );
  }

  public canHandle(symbol: string) {
    return true;
  }

  public async getAssetProfile(
    aSymbol: string
  ): Promise<Partial<SymbolProfile>> {
    return {
      dataSource: this.getName(),
      symbol: aSymbol
    };
  }

  public async getDividends({}: GetDividendsParams) {
    return {};
  }

  public async getHistorical({
    from,
    requestTimeout = this.configurationService.get('REQUEST_TIMEOUT'),
    symbol,
    to
  }: GetHistoricalParams): Promise<{
    [symbol: string]: { [date: string]: IDataProviderHistoricalResponse };
  }> {
    try {
      const abortController = new AbortController();

      setTimeout(() => {
        abortController.abort();
      }, requestTimeout);

      const { historical } = await got(
        `${this.URL}/historical-price-full/${symbol}?apikey=${this.apiKey}`,
        {
          // @ts-ignore
          signal: abortController.signal
        }
      ).json<any>();

      const result: {
        [symbol: string]: { [date: string]: IDataProviderHistoricalResponse };
      } = {
        [symbol]: {}
      };

      for (const { close, date } of historical) {
        if (
          (isSameDay(parseDate(date), from) ||
            isAfter(parseDate(date), from)) &&
          isBefore(parseDate(date), to)
        ) {
          result[symbol][date] = {
            marketPrice: close
          };
        }
      }

      return result;
    } catch (error) {
      throw new Error(
        `Could not get historical market data for ${symbol} (${this.getName()}) from ${format(
          from,
          DATE_FORMAT
        )} to ${format(to, DATE_FORMAT)}: [${error.name}] ${error.message}`
      );
    }
  }

  public getName(): DataSource {
    return DataSource.FINANCIAL_MODELING_PREP;
  }

  public async getQuotes({
    requestTimeout = this.configurationService.get('REQUEST_TIMEOUT'),
    symbols
  }: GetQuotesParams): Promise<{ [symbol: string]: IDataProviderResponse }> {
    const response: { [symbol: string]: IDataProviderResponse } = {};

    if (symbols.length <= 0) {
      return response;
    }

    try {
      const abortController = new AbortController();

      setTimeout(() => {
        abortController.abort();
      }, requestTimeout);

      const quotes = await got(
        `${this.URL}/quote/${symbols.join(',')}?apikey=${this.apiKey}`,
        {
          // @ts-ignore
          signal: abortController.signal
        }
      ).json<any>();

      for (const { price, symbol } of quotes) {
        response[symbol] = {
          currency: DEFAULT_CURRENCY,
          dataProviderInfo: this.getDataProviderInfo(),
          dataSource: DataSource.FINANCIAL_MODELING_PREP,
          marketPrice: price,
          marketState: 'delayed'
        };
      }
    } catch (error) {
      let message = error;

      if (error?.code === 'ABORT_ERR') {
        message = `RequestError: The operation was aborted because the request to the data provider took more than ${this.configurationService.get(
          'REQUEST_TIMEOUT'
        )}ms`;
      }

      Logger.error(message, 'FinancialModelingPrepService');
    }

    return response;
  }

  public getTestSymbol() {
    return 'AAPL';
  }

  public async search({
    query
  }: GetSearchParams): Promise<{ items: LookupItem[] }> {
    let items: LookupItem[] = [];

    try {
      const abortController = new AbortController();

      setTimeout(() => {
        abortController.abort();
      }, this.configurationService.get('REQUEST_TIMEOUT'));

      const result = await got(
        `${this.URL}/search?query=${query}&apikey=${this.apiKey}`,
        {
          // @ts-ignore
          signal: abortController.signal
        }
      ).json<any>();

      items = result.map(({ currency, name, symbol }) => {
        return {
          // TODO: Add assetClass
          // TODO: Add assetSubClass
          currency,
          name,
          symbol,
          dataSource: this.getName()
        };
      });
    } catch (error) {
      let message = error;

      if (error?.code === 'ABORT_ERR') {
        message = `RequestError: The operation was aborted because the request to the data provider took more than ${this.configurationService.get(
          'REQUEST_TIMEOUT'
        )}ms`;
      }

      Logger.error(message, 'FinancialModelingPrepService');
    }

    return { items };
  }

  private getDataProviderInfo(): DataProviderInfo {
    return {
      name: 'Financial Modeling Prep',
      url: 'https://financialmodelingprep.com/developer/docs'
    };
  }
}
