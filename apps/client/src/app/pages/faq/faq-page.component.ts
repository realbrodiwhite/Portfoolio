import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { UserService } from '@portfoolio/client/services/user/user.service';
import { User } from '@portfoolio/common/interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
  host: { class: 'page' },
  selector: 'gf-faq-page',
  styleUrls: ['./faq-page.scss'],
  templateUrl: './faq-page.html'
})
export class FaqPageComponent implements OnDestroy {
  public routerLinkFeatures = ['/' + $localize`features`];
  public routerLinkMarkets = ['/' + $localize`markets`];
  public routerLinkPricing = ['/' + $localize`pricing`];
  public routerLinkRegister = ['/' + $localize`register`];
  public user: User;

  private unsubscribeSubject = new Subject<void>();

  public constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService
  ) {}

  public ngOnInit() {
    this.userService.stateChanged
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((state) => {
        if (state?.user) {
          this.user = state.user;

          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
