import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@portfoolio/client/core/auth.guard';

import { FeaturesPageComponent } from './features-page.component';

const routes: Routes = [
  {
    canActivate: [AuthGuard],
    component: FeaturesPageComponent,
    path: '',
    title: $localize`Features`
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesPageRoutingModule {}
