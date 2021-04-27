/**
 * From: https://github.com/angular-extensions/model
 */


import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import {
  map,
  shareReplay,
} from 'rxjs/operators';


/**
 * Simple state management with minimalistic API, one way data flow and data exposed as RxJS
 * Observable.
 *
 * @class Model
 * @template T
 */
class Model<T = unknown> {

  protected readonly data: BehaviorSubject<T> = null;
  public readonly data$: Observable<T> = null;

  constructor(
    initialData: T,
    protected clone?: (data: T) => T,
  ) {
    this.data = new BehaviorSubject(initialData);
    this.data$ = this.data.asObservable().pipe(
      map((data) => !!this.clone ? this.clone(data) : data),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  public get(): T {
    const data = this.data.getValue();
    return !!this.clone ? this.clone(data) : data;
  }

  public set(data: T): void {
    this.data.next(!!this.clone ? this.clone(data) : data);
  }

}


export {
  Model,
};
