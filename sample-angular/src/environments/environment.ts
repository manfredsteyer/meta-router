// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: 'v1.2 testing',
  apiAuthUrl: 'http://authapi?/api/',
  auth: false,
  portalName: 'New Portal',
  sites: {
    Name: 'Home',
    Path: 'https://s.codepen.io/thiswallz/debug/NBLZYo/wQMPoNNNgDZk',
    Children: [
      {
        Name: 'Css Game',
        Icon: 'fa-list-alt',
        Path: 'https://s.codepen.io/thiswallz/debug/GBXbYG/nqAwvGGGZEor',
        Order: 0,
        Visible: true,
        RequiredPrivilege: null,
        Children: null
      },
      {
        Name: 'Code pin examples',
        Icon: 'fa-desktop',
        Path: null,
        Order: 0,
        Visible: true,
        RequiredPrivilege: null,
        Children: [
          {
            Name: 'House illustration',
            Path: 'https://s.codepen.io/thiswallz/debug/EpeBrN/gaMeYZZZoXnM',
            Order: 1,
            Visible: true,
            RequiredPrivilege: null,
            Children: null
          },
          {
            Name: 'Grid css animation',
            Path: 'https://s.codepen.io/thiswallz/debug/JBaQeN/wQrPoNNNgvGM',
            Order: 2,
            Visible: true,
            RequiredPrivilege: null,
            Children: null
          }
        ]
      },
      {
        Name: 'Atom',
        Icon: 'fa-award',
        Path: '',
        Order: 0
      },
      {
        Name: 'Capsules',
        Icon: 'fa-capsules',
        Path: '',
        Order: 0
      },
      {
        Name: 'Bills',
        Icon: 'fa-euro-sign',
        Path: '',
        Order: 0
      },
      {
        Name: 'External',
        Icon: 'fa-eye',
        Path: '',
        Order: 0
      },
      {
        Name: 'Messages',
        Icon: 'fa-envelope',
        Path: '',
        Order: 0,
        Children: []
      },
      {
        Name: 'Email',
        Icon: 'fa-envelope-open',
        Path: '',
        Order: 0,
        Children: []
      },
      {
        Name: 'Filters',
        Icon: 'fa-filter',
        Path: '',
        Order: 0,
        Children: []
      },
      {
        Name: 'Games',
        Icon: 'fa-gamepad',
        Path: '',
        Order: 0,
        Children: []
      },
      {
        Name: 'Sports',
        Icon: 'fa-futbol',
        Path: '',
        Order: 0,
        Children: []
      }
    ]
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
