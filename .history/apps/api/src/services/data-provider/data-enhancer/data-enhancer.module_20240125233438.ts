import { ConfigurationModule } from '@portfoolio/api/services/configuration/configuration.module';
import { CryptocurrencyModule } from '@portfoolio/api/services/cryptocurrency/cryptocurrency.module';
import { OpenFigiDataEnhancerService } from '@portfoolio/api/services/data-provider/data-enhancer/openfigi/openfigi.service';
import { TrackinsightDataEnhancerService } from '@portfoolio/api/services/data-provider/data-enhancer/trackinsight/trackinsight.service';
import { YahooFinanceDataEnhancerService } from '@portfoolio/api/services/data-provider/data-enhancer/yahoo-finance/yahoo-finance.service';
import { Module } from '@nestjs/common';

import { DataEnhancerService } from './data-enhancer.service';

@Module({
  exports: [
    DataEnhancerService,
    OpenFigiDataEnhancerService,
    TrackinsightDataEnhancerService,
    YahooFinanceDataEnhancerService,
    'DataEnhancers'
  ],
  imports: [ConfigurationModule, CryptocurrencyModule],
  providers: [
    DataEnhancerService,
    OpenFigiDataEnhancerService,
    TrackinsightDataEnhancerService,
    YahooFinanceDataEnhancerService,
    {
      inject: [
        OpenFigiDataEnhancerService,
        TrackinsightDataEnhancerService,
        YahooFinanceDataEnhancerService
      ],
      provide: 'DataEnhancers',
      useFactory: (openfigi, trackinsight, yahooFinance) => [
        openfigi,
        trackinsight,
        yahooFinance
      ]
    }
  ]
})
export class DataEnhancerModule {}
