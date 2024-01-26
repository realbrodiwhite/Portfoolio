import { TransformDataSourceInResponseInterceptor } from '@portfoolio/api/interceptors/transform-data-source-in-response.interceptor';
import { InfoItem } from '@portfoolio/common/interfaces';
import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { InfoService } from './info.service';

@Controller('info')
export class InfoController {
  public constructor(private readonly infoService: InfoService) {}

  @Get()
  @UseInterceptors(TransformDataSourceInResponseInterceptor)
  public async getInfo(): Promise<InfoItem> {
    return this.infoService.get();
  }
}
