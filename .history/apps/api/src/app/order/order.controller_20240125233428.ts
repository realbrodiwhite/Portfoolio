import { HasPermission } from '@portfoolio/api/decorators/has-permission.decorator';
import { HasPermissionGuard } from '@portfoolio/api/guards/has-permission.guard';
import { RedactValuesInResponseInterceptor } from '@portfoolio/api/interceptors/redact-values-in-response.interceptor';
import { TransformDataSourceInRequestInterceptor } from '@portfoolio/api/interceptors/transform-data-source-in-request.interceptor';
import { TransformDataSourceInResponseInterceptor } from '@portfoolio/api/interceptors/transform-data-source-in-response.interceptor';
import { ApiService } from '@portfoolio/api/services/api/api.service';
import { DataGatheringService } from '@portfoolio/api/services/data-gathering/data-gathering.service';
import { ImpersonationService } from '@portfoolio/api/services/impersonation/impersonation.service';
import { HEADER_KEY_IMPERSONATION } from '@portfoolio/common/config';
import { hasPermission, permissions } from '@portfoolio/common/permissions';
import type { RequestWithUser } from '@portfoolio/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Order as OrderModel, Prisma } from '@prisma/client';
import { parseISO } from 'date-fns';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { CreateOrderDto } from './create-order.dto';
import { Activities } from './interfaces/activities.interface';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './update-order.dto';

@Controller('order')
export class OrderController {
  public constructor(
    private readonly apiService: ApiService,
    private readonly dataGatheringService: DataGatheringService,
    private readonly impersonationService: ImpersonationService,
    private readonly orderService: OrderService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @Delete()
  @HasPermission(permissions.deleteOrder)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async deleteOrders(): Promise<number> {
    return this.orderService.deleteOrders({
      userId: this.request.user.id
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async deleteOrder(@Param('id') id: string): Promise<OrderModel> {
    const order = await this.orderService.order({ id });

    if (
      !hasPermission(this.request.user.permissions, permissions.deleteOrder) ||
      !order ||
      order.userId !== this.request.user.id
    ) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.FORBIDDEN),
        StatusCodes.FORBIDDEN
      );
    }

    return this.orderService.deleteOrder({
      id
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  @UseInterceptors(RedactValuesInResponseInterceptor)
  @UseInterceptors(TransformDataSourceInResponseInterceptor)
  public async getAllOrders(
    @Headers(HEADER_KEY_IMPERSONATION.toLowerCase()) impersonationId,
    @Query('accounts') filterByAccounts?: string,
    @Query('assetClasses') filterByAssetClasses?: string,
    @Query('skip') skip?: number,
    @Query('sortColumn') sortColumn?: string,
    @Query('sortDirection') sortDirection?: Prisma.SortOrder,
    @Query('tags') filterByTags?: string,
    @Query('take') take?: number
  ): Promise<Activities> {
    const filters = this.apiService.buildFiltersFromQueryParams({
      filterByAccounts,
      filterByAssetClasses,
      filterByTags
    });

    const impersonationUserId =
      await this.impersonationService.validateImpersonationId(impersonationId);
    const userCurrency = this.request.user.Settings.settings.baseCurrency;

    const { activities, count } = await this.orderService.getOrders({
      filters,
      sortColumn,
      sortDirection,
      userCurrency,
      includeDrafts: true,
      skip: isNaN(skip) ? undefined : skip,
      take: isNaN(take) ? undefined : take,
      userId: impersonationUserId || this.request.user.id,
      withExcludedAccounts: true
    });

    return { activities, count };
  }

  @HasPermission(permissions.createOrder)
  @Post()
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  @UseInterceptors(TransformDataSourceInRequestInterceptor)
  public async createOrder(@Body() data: CreateOrderDto): Promise<OrderModel> {
    const order = await this.orderService.createOrder({
      ...data,
      date: parseISO(data.date),
      SymbolProfile: {
        connectOrCreate: {
          create: {
            currency: data.currency,
            dataSource: data.dataSource,
            symbol: data.symbol
          },
          where: {
            dataSource_symbol: {
              dataSource: data.dataSource,
              symbol: data.symbol
            }
          }
        }
      },
      User: { connect: { id: this.request.user.id } },
      userId: this.request.user.id
    });

    if (data.dataSource && !order.isDraft) {
      // Gather symbol data in the background, if data source is set
      // (not MANUAL) and not draft
      this.dataGatheringService.gatherSymbols([
        {
          dataSource: data.dataSource,
          date: order.date,
          symbol: data.symbol
        }
      ]);
    }

    return order;
  }

  @HasPermission(permissions.updateOrder)
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  @UseInterceptors(TransformDataSourceInRequestInterceptor)
  public async update(@Param('id') id: string, @Body() data: UpdateOrderDto) {
    const originalOrder = await this.orderService.order({
      id
    });

    if (!originalOrder || originalOrder.userId !== this.request.user.id) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.FORBIDDEN),
        StatusCodes.FORBIDDEN
      );
    }

    const date = parseISO(data.date);

    const accountId = data.accountId;
    delete data.accountId;

    return this.orderService.updateOrder({
      data: {
        ...data,
        date,
        Account: {
          connect: {
            id_userId: { id: accountId, userId: this.request.user.id }
          }
        },
        SymbolProfile: {
          connect: {
            dataSource_symbol: {
              dataSource: data.dataSource,
              symbol: data.symbol
            }
          },
          update: {
            assetClass: data.assetClass,
            assetSubClass: data.assetSubClass,
            name: data.symbol
          }
        },
        User: { connect: { id: this.request.user.id } }
      },
      where: {
        id
      }
    });
  }
}
