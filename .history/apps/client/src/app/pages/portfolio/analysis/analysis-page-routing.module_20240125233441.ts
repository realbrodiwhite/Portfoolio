import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@portfoolio/client/core/auth.guard';

import { AnalysisPageComponent } from './analysis-page.component';

const routes: Routes = [
  {
    canActivate: [AuthGuard],
    component: AnalysisPageComponent,
    path: '',
    title: $localize`Analysis`
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisPageRoutingModule {}
