import {
  from,
  fromEvent,
  Observable,
} from 'rxjs';

import {
  first,
  flatMap,
} from 'rxjs/operators';


type BackButtonEvent = Event & { type: 'backbutton' };
type DevicePlatform = 'cordova' | 'desktop';

let _readyResolve: (value: DevicePlatform) => void;
const _readyPromise: Promise<DevicePlatform> = new Promise((resolve) => _readyResolve = resolve);

window.onload = () => {
  if(!!window['cordova']) {
    document.addEventListener('deviceready', () => _readyResolve('cordova'), { once: true });
  } else { _readyResolve('desktop'); }
};

/**
 * This event is essential to any application. It signals that Cordova's device APIs have loaded and
 * are ready to access.
 *
 * The `deviceready` event fires once Cordova has fully loaded. Once the event fires, you can
 * safely make calls to Cordova APIs.
 *
 * @returns {Promise<DevicePlatform>}
 */
async function onDeviceReady(): Promise<DevicePlatform> {
  return await _readyPromise;
}

/**
 * This event is essential to any application. It signals that Cordova's device APIs have loaded and
 * are ready to access.
 *
 * The `deviceready` event fires once Cordova has fully loaded. Once the event fires, you can
 * safely make calls to Cordova APIs.
 *
 * This `Observable` will emit once, then completes (it's not necessary to unsubscribe).
 *
 * @returns {Observable<DevicePlatform>}
 * @see onDeviceReady
 */
function onDeviceReady$(): Observable<DevicePlatform> {
  return from(_readyPromise).pipe(first());
}

/**
 * Subscribe to this `Observable` to override the default back-button behavior. It is no longer
 * necessary to call any other method to override the back-button behavior.
 *
 * When unsubscribed, the default behavior will be used.
 *
 * @returns {Observable<BackButtonEvent>}
 */
function onBackButton$(): Observable<BackButtonEvent> {
  return from(_readyPromise).pipe(flatMap(() => fromEvent<BackButtonEvent>(document, 'backbutton')));
}


export {
  BackButtonEvent,
  DevicePlatform,
  onBackButton$,
  onDeviceReady,
  onDeviceReady$,
};
