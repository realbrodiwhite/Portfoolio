import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { products } from '../products';
import { BaseProductPageComponent } from './base-page.component';

@Component({
  host: { class: 'page' },
  imports: [CommonModule, MatButtonModule, RouterModule],
  selector: 'gf-intuit-mint-page',
  standalone: true,
  styleUrls: ['../product-page-template.scss'],
  templateUrl: '../product-page-template.html'
})
export class IntuitMintPageComponent extends BaseProductPageComponent {
  public product1 = products.find(({ key }) => {
    return key === 'portfoolio';
  });

  public product2 = products.find(({ key }) => {
    return key === 'intuit-mint';
  });

  public routerLinkAbout = ['/' + $localize`about`];
  public routerLinkFeatures = ['/' + $localize`features`];
  public routerLinkResourcesPersonalFinanceTools = [
    '/' + $localize`resources`,
    'personal-finance-tools'
  ];
}
