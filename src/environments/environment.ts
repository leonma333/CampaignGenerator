// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/* tslint:disable:no-string-literal */
export const environment = {
  production: false,
  firebase: {
    apiKey: window['env']['firebase_apiKey_'],
    authDomain: window['env']['firebase_authDomain'],
    databaseURL: window['env']['firebase_databaseURL'],
    projectId: window['env']['firebase_projectId'],
    storageBucket: window['env']['firebase_storageBucket'],
    messagingSenderId: window['env']['firebase_messagingSenderId'],
    appId: window['env']['firebase_appId'],
    measurementId: window['env']['firebase_measurementId']
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
