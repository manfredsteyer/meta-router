# Angular and Microservices: Micro-Frontends with iframes 

## Features

- Meta Router for creating shell app that loads routed applications ("child apps") using iframes
- iframes are created at runtime
- Allows jumping to a specific route within child app
- Synchronizing child app's routes with the shell's route
- Resizes the iframes to prevent a scrollbar within the iframe
- Written in VanillaJS to allow shell app to be as slim as possible
- Tested with ``HashLocationStrategy``
- Tested w/ Chrome, Firefox, Edge and IE 11

## Config

- see ``index.html`` for setting up the meta routes
- see ``app-a/src/app/index.html`` for initializing child apps
- see ``app-a/src/app/app.component.ts`` for synchronizing the child app's route with the shell's route

## Trying it out

1. Install the libs for each child app and build them:
```
    cd app-a
    npm install
    ng build

    cd ..

    cd app-b
    npm install
    ng build

    cd ..
```

2. Start the shell app with a web server of your choice, e. g. ``http-server``

```
    npm install -g http-server
    http-server -o
```

## Blog

More infos about this and Angular can be found on my [blog](http://www.softwarearchitekt.at).