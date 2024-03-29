import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GfAdminJobsModule } from '@portfoolio/client/components/admin-jobs/admin-jobs.module';
import { GfAdminMarketDataModule } from '@portfoolio/client/components/admin-market-data/admin-market-data.module';
import { GfAdminOverviewModule } from '@portfoolio/client/components/admin-overview/admin-overview.module';
import { GfAdminSettingsModule } from '@portfoolio/client/components/admin-settings/admin-settings.module';
import { GfAdminUsersModule } from '@portfoolio/client/components/admin-users/admin-users.module';
import { CacheService } from '@portfoolio/client/services/cache.service';

import { AdminPageRoutingModule } from './admin-page-routing.module';
import { AdminPageComponent } from './admin-page.component';

@NgModule({
  declarations: [AdminPageComponent],
  exports: [],
  imports: [
    AdminPageRoutingModule,
    CommonModule,
    GfAdminJobsModule,
    GfAdminMarketDataModule,
    GfAdminOverviewModule,
    GfAdminSettingsModule,
    GfAdminUsersModule,
    MatTabsModule
  ],
  providers: [CacheService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminPageModule {}
