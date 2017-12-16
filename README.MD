# meta-spa-router: A lightweight and solid approach towards micro frontends (SPAs/ clients for micro services) 

## Features

- Meta Router for creating a shell app that loads routed applications ("child apps") using iframes
- iframes are created at runtime
- Allows jumping to a specific route within a child app
- Synchronizing child app's routes with the shell's route
- Resizes the iframes to prevent a scrollbar within the iframe
- Tested with Hash-based routing
- Tested w/ Chrome, Firefox, Edge and IE 11

## Installation

```
npm install meta-spa-router --save
```

## Usage 

Setting up the routes in the shell app:

```JavaScript
var MetaRouter = require('meta-spa-router').MetaRouter;

var config = [
    {
        path: 'a',
        app: '/app-a/dist'
    },
    {
        path: 'b',
        app: '/app-b/dist'
    }
];

window.addEventListener('load', function() { 

    var router = new MetaRouter();
    router.config(config);
    router.init();
    router.preload();


    document.getElementById('link-a')
            .addEventListener('click', function() { router.go('a') });

    document.getElementById('link-b')
            .addEventListener('click', function() { router.go('b') });

    document.getElementById('link-aa')
            .addEventListener('click', function() { router.go('a', 'a') });

            document.getElementById('link-ab')
            .addEventListener('click', function() { router.go('a', 'b') });        

}); 
```

Setting up the routed client apps (Framework agnostic way):

```TypeScript
    import { RoutedApp } from 'meta-spa-router';

    let routedApp = new RoutedApp();

    routedApp.config({ appId: 'a' });
    routedApp.init();

    [...]

    // When we change the route in the client app, tell the shell about it:
    routedApp.sendRoute(e.url);

    // When the shell changes the route, we have to tell our router about it:
    routedApp.registerForRouteChange(url => /* delegate url to your app's router */);
```

Please note that by convention the ``appId`` is the same as its ``path`` in the shell app.

The example below uses Angular and it's DI system for this task.

## Example

- see folder ``sample`` [in the libs repo](https://github.com/manfredsteyer/meta-router).
- see ``index.js`` for setting up the meta routes
- see ``app-a/src/app/app.module.ts`` - Even though this works with any framework, this client app uses Angular and it's Dependency Injection (DI) system. In this file, the ChildApp class is registered as a service. Instead of this you could also instanciate it directly when going with an other framework.
- see ``app-a/src/app/app.component.ts`` for initializing child apps. Again, using Angular's DI which is not a condition.

## Trying it out

1. Install the libs for each child app and build them:
```
    cd app-a
    npm install
    npm run build

    cd ..

    cd app-b
    npm install
    npm run build

    cd ..
```

2. Do the same for the shell app:

```
    npm install
    npm run build
```

2. Start the shell app with a web server of your choice, e. g. ``http-server``

```
    npm install -g http-server
    http-server -o
```

## Blog

More infos about this and Angular can be found on my [blog](http://www.softwarearchitekt.at).