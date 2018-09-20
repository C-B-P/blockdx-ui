import { Component, OnInit, NgZone } from '@angular/core';

import { BaseComponent } from '../base.component';
import { AppService } from '../app.service';
import { Openorder } from '../openorder';
import { OpenordersService } from '../openorders.service';
import { PricingService } from '../pricing.service';
import { Pricing } from '../pricing';

@Component({
  selector: 'bn-filled-orders',
  templateUrl: './filled-orders.component.html',
  styleUrls: ['./filled-orders.component.scss']
})
export class FilledOrdersComponent extends BaseComponent implements OnInit {
  public symbols: string[] = [];
  public filledorders: Openorder[];
  public pricing: Pricing;
  public pricingEnabled = false;

  constructor(
    private appService: AppService,
    private openorderService: OpenordersService,
    private pricingService: PricingService,
    private zone: NgZone
  ) { super(); }

  ngOnInit() {
    this.appService.marketPairChanges
      .takeUntil(this.$destroy)
      .subscribe((symbols) => {
        this.symbols = symbols;
    });
    // this.openorderService.getOpenorders()
    //   .then((filledorders) => {
    //     this.filledorders = filledorders
    //       .filter(o => o.settled)
    //       .map((o) => {
    //         o['row_class'] = o.side;
    //         return o;
    //       });
    //   });
    this.openorderService.getOpenorders()
      .subscribe(openorders => {
        this.zone.run(() => {
          this.filledorders = openorders
            .filter(o => o.status === 'finished' || o.status === 'canceled')
            .map((o) => {
              o['row_class'] = o.side;
              return o;
            });
          // console.log('filledorders', this.filledorders);
        });
      });

    this.pricingService.getPricing().subscribe(pricing => {
      this.zone.run(() => {
        this.pricing = pricing;
        this.pricingEnabled = pricing.enabled;
      });
    });

  }
}
