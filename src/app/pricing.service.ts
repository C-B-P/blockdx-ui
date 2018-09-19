import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Pricing } from './pricing';

@Injectable()
export class PricingService {

  private pricingObservable: Observable<Pricing>;

  constructor(private http: Http) { }

  /**
   * Returns pricing objects
   * @returns {Observable<Pricing[]>}
   */
  public getPricing(): Observable<Pricing> {
    const { ipcRenderer } = window.electron;
    if (!this.pricingObservable) {
      this.pricingObservable = Observable.create(observer => {
        try {
          ipcRenderer.on('pricingMultipliers', (e, items) => {
            const pricing = new Pricing(items);
            observer.next(pricing);
          });
          ipcRenderer.send('getPricing');
        } catch(err) {
          console.error(err);
        }
      });
    }
    return this.pricingObservable;
  }

}
