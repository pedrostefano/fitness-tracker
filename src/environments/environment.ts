// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCWlzMBW8aj5bxvpQgTplT9JVmhutCHm84',
    authDomain: 'ng-fitness-tracker-b121c.firebaseapp.com',
    databaseURL: 'https://ng-fitness-tracker-b121c.firebaseio.com',
    projectId: 'ng-fitness-tracker-b121c',
    storageBucket: 'ng-fitness-tracker-b121c.appspot.com',
    messagingSenderId: '278939013523'
  }
};
