import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@portfoolio/client/core/auth.guard';

import { PrivacyPolicyPageComponent } from './privacy-policy-page.component';

const routes: Routes = [
  {
    canActivate: [AuthGuard],
    component: PrivacyPolicyPageComponent,
    path: '',
    title: $localize`Privacy Policy`
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class PrivacyPolicyPageRoutingModule {}
