import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  getNumberFormatDecimal,
  getNumberFormatGroup
} from '@portfoolio/common/helper';
import {
  PortfolioPerformance,
  ResponseError
} from '@portfoolio/common/interfaces';
import { CountUp } from 'countup.js';
import { isNumber } from 'lodash';

@Component({
  selector: 'gf-portfolio-performance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portfolio-performance.component.html',
  styleUrls: ['./portfolio-performance.component.scss']
})
export class PortfolioPerformanceComponent implements OnChanges, OnInit {
  @Input() deviceType: string;
  @Input() errors: ResponseError['errors'];
  @Input() isAllTimeHigh: boolean;
  @Input() isAllTimeLow: boolean;
  @Input() isLoading: boolean;
  @Input() locale: string;
  @Input() performance: PortfolioPerformance;
  @Input() showDetails: boolean;
  @Input() unit: string;

  @ViewChild('value') value: ElementRef;

  public constructor() {}

  public ngOnInit() {}

  public ngOnChanges() {
    if (this.isLoading) {
      if (this.value?.nativeElement) {
        this.value.nativeElement.innerHTML = '';
      }
    } else {
      if (isNumber(this.performance?.currentValue)) {
        new CountUp('value', this.performance?.currentValue, {
          decimal: getNumberFormatDecimal(this.locale),
          decimalPlaces:
            this.deviceType === 'mobile' &&
            this.performance?.currentValue >= 100000
              ? 0
              : 2,
          duration: 1,
          separator: getNumberFormatGroup(this.locale)
        }).start();
      } else if (this.performance?.currentValue === null) {
        new CountUp(
          'value',
          this.performance?.currentNetPerformancePercent * 100,
          {
            decimal: getNumberFormatDecimal(this.locale),
            decimalPlaces: 2,
            duration: 1,
            separator: getNumberFormatGroup(this.locale)
          }
        ).start();
      }
    }
  }

  public onShowErrors() {
    const errorMessageParts = [$localize`Market data is delayed for`];

    for (const error of this.errors) {
      errorMessageParts.push(`${error.symbol} (${error.dataSource})`);
    }

    alert(errorMessageParts.join('\n'));
  }
}
