import { HasPermission } from '@portfoolio/api/decorators/has-permission.decorator';
import { HasPermissionGuard } from '@portfoolio/api/guards/has-permission.guard';
import { TransformDataSourceInRequestInterceptor } from '@portfoolio/api/interceptors/transform-data-source-in-request.interceptor';
import { TransformDataSourceInResponseInterceptor } from '@portfoolio/api/interceptors/transform-data-source-in-response.interceptor';
import type {
  BenchmarkMarketDataDetails,
  BenchmarkResponse,
  UniqueAsset
} from '@portfoolio/common/interfaces';
import { permissions } from '@portfoolio/common/permissions';
import type { RequestWithUser } from '@portfoolio/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { DataSource } from '@prisma/client';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { BenchmarkService } from './benchmark.service';

@Controller('benchmark')
export class BenchmarkController {
  public constructor(
    private readonly benchmarkService: BenchmarkService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @HasPermission(permissions.accessAdminControl)
  @Post()
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async addBenchmark(@Body() { dataSource, symbol }: UniqueAsset) {
    try {
      const benchmark = await this.benchmarkService.addBenchmark({
        dataSource,
        symbol
      });

      if (!benchmark) {
        throw new HttpException(
          getReasonPhrase(StatusCodes.NOT_FOUND),
          StatusCodes.NOT_FOUND
        );
      }

      return benchmark;
    } catch {
      throw new HttpException(
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':dataSource/:symbol')
  @HasPermission(permissions.accessAdminControl)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async deleteBenchmark(
    @Param('dataSource') dataSource: DataSource,
    @Param('symbol') symbol: string
  ) {
    try {
      const benchmark = await this.benchmarkService.deleteBenchmark({
        dataSource,
        symbol
      });

      if (!benchmark) {
        throw new HttpException(
          getReasonPhrase(StatusCodes.NOT_FOUND),
          StatusCodes.NOT_FOUND
        );
      }

      return benchmark;
    } catch {
      throw new HttpException(
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @UseInterceptors(TransformDataSourceInRequestInterceptor)
  @UseInterceptors(TransformDataSourceInResponseInterceptor)
  public async getBenchmark(): Promise<BenchmarkResponse> {
    return {
      benchmarks: await this.benchmarkService.getBenchmarks()
    };
  }

  @Get(':dataSource/:symbol/:startDateString')
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  @UseInterceptors(TransformDataSourceInRequestInterceptor)
  public async getBenchmarkMarketDataBySymbol(
    @Param('dataSource') dataSource: DataSource,
    @Param('startDateString') startDateString: string,
    @Param('symbol') symbol: string
  ): Promise<BenchmarkMarketDataDetails> {
    const startDate = new Date(startDateString);
    const userCurrency = this.request.user.Settings.settings.baseCurrency;

    return this.benchmarkService.getMarketDataBySymbol({
      dataSource,
      startDate,
      symbol,
      userCurrency
    });
  }
}