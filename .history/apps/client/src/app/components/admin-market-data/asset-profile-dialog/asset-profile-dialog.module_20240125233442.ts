import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GfAdminMarketDataDetailModule } from '@portfoolio/client/components/admin-market-data-detail/admin-market-data-detail.module';
import { GfCurrencySelectorModule } from '@portfoolio/ui/currency-selector/currency-selector.module';
import { GfPortfolioProportionChartModule } from '@portfoolio/ui/portfolio-proportion-chart/portfolio-proportion-chart.module';
import { GfValueModule } from '@portfoolio/ui/value';

import { AssetProfileDialog } from './asset-profile-dialog.component';

@NgModule({
  declarations: [AssetProfileDialog],
  imports: [
    CommonModule,
    FormsModule,
    GfAdminMarketDataDetailModule,
    GfCurrencySelectorModule,
    GfPortfolioProportionChartModule,
    GfValueModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    TextFieldModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GfAssetProfileDialogModule {}
