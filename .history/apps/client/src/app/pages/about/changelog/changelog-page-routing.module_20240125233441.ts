import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@portfoolio/client/core/auth.guard';

import { ChangelogPageComponent } from './changelog-page.component';

const routes: Routes = [
  {
    canActivate: [AuthGuard],
    component: ChangelogPageComponent,
    path: '',
    title: $localize`Changelog`
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangelogPageRoutingModule {}
