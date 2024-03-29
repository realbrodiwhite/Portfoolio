import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@portfoolio/client/core/auth.guard';

import { AllocationsPageComponent } from './allocations-page.component';

const routes: Routes = [
  {
    canActivate: [AuthGuard],
    component: AllocationsPageComponent,
    path: '',
    title: $localize`Allocations`
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocationsPageRoutingModule {}
