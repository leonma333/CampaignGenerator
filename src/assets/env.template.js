(function(window) {
  window.env = window.env || {};

  // Environment variables
  window['env']['firebase_apiKey_'] = '${FIREBASE_APIKEY}';
  window['env']['firebase_authDomain'] = '${FIREBASE_AUTHDOMAIN}';
  window['env']['firebase_databaseURL'] = '${FIREBASE_DATABASE_URL}';
  window['env']['firebase_projectId'] = '${FIREBASE_PROJECTID}';
  window['env']['firebase_storageBucket'] = '${FIREBASE_STORAGE_BUCKET}';
  window['env']['firebase_messagingSenderId'] = '${FIREBASE_MESSAGING_SENDERID}';
  window['env']['firebase_appId'] = '${FIREBASE_APPID}';
  window['env']['firebase_measurementId'] = '${FIREBASE_MEASUREMENTID}';
})(this);
