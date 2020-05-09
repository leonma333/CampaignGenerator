export const environment = {
  production: true,
  firebase: {
    apiKey: window['env']['firebase_apikey'],
    authDomain: window['env']['firebase_authDomain'],
    databaseURL: window['env']['firebase_databaseURL'],
    projectId: window['env']['firebase_projectId'],
    storageBucket: window['env']['firebase_storageBucket'],
    messagingSenderId: window['env']['firebase_messagingSenderId'],
    appId: window['env']['firebase_appId'],
    measurementId: window['env']['firebase_measurementId']
  }
};
