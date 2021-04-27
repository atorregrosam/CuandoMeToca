import {
  fromEvent,
  Observable,
} from 'rxjs';

import {
  map,
  startWith,
} from 'rxjs/operators';


/**
 * Immediately returns if the `Document` matches the specified *media query* string. It can also be
 * used to monitor the `Document` to detect when it matches or stops matching.
 *
 * @param {string} query
 * @returns {Observable<boolean>}
 */
function onMatchMedia$(query: string): Observable<boolean> {
  const mql = matchMedia(query);

  return fromEvent<MediaQueryListEvent>(mql, 'change').pipe(
    map(({ matches }) => matches),
    startWith(mql.matches),
  );
}


export {
  onMatchMedia$,
};
