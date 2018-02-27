/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var MetaRouter = __webpack_require__(1).MetaRouter;

var config = [
    {
        path: 'a',
        app: '/app-a/dist',
        outlet: 'outlet'
    },
    {
        path: 'b',
        app: '/app-b/dist',
        outlet: 'outlet'
    }
];


window.addEventListener('load', function() { 

    var router = new MetaRouter();
    router.config(config);
    router.init();
    router.preload();

    router.additionalConfig.handleNotification = function (tag, data)  {
        console.debug('received message from routed app', {tag, data});
    }


    document.getElementById('link-a')
            .addEventListener('click', function() { router.go('a') });

    document.getElementById('link-b')
            .addEventListener('click', function() { router.go('b') });

    document.getElementById('link-aa')
            .addEventListener('click', function() { router.go('a', 'a') });

            document.getElementById('link-ab')
            .addEventListener('click', function() { router.go('a', 'b') });        

}); 


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(2));
__export(__webpack_require__(4));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var url_parser_1 = __webpack_require__(3);
/**
 * MetaRouter for routing between micro frontends
 */
var MetaRouter = /** @class */ (function () {
    function MetaRouter() {
        this.additionalConfig = {
            hashPrefix: '/',
            additionalHeight: 5,
            handleNotification: function () { }
        };
        this.routes = new Array();
        this.urlParser = new url_parser_1.UrlParser();
    }
    MetaRouter.prototype.config = function (routes) { this.routes = routes; };
    /**
     * initializes the router after configuring it
     */
    MetaRouter.prototype.init = function () {
        window.addEventListener('hashchange', this.routeByUrl.bind(this), false);
        window.addEventListener('message', this.handleMessage.bind(this), false);
        if (!location.hash && this.routes && this.routes.length > 0) {
            var defaultRoute = this.routes[0];
            this.go(defaultRoute.path);
        }
        else {
            this.routeByUrl();
        }
    };
    /**
     * Preloads all the micro frontends by loading them into the page
     */
    MetaRouter.prototype.preload = function () {
        var _this = this;
        this.routes.forEach(function (route) {
            _this.ensureIframeCreated(route);
        });
    };
    /**
     * Navigates to a configured meta route
     * @param path path of the routed client app
     * @param subRoute subRoute passed to the client app
     */
    MetaRouter.prototype.go = function (path, subRoute) {
        var route = this.routes.find(function (r) {
            return r.path === path;
        });
        if (!route)
            throw Error('route not found: ' + route);
        this.ensureIframeCreated(route, subRoute);
        this.activateRoute(route, subRoute);
    };
    MetaRouter.prototype.handleMessage = function (event) {
        if (!event.data)
            return;
        if (event.data.message === 'routed') {
            var route = this.routes.find(function (r) { return r.path === event.data.appPath; });
            this.setRouteInHash(route, event.data.route);
        }
        else if (event.data.message === 'set-height') {
            this.resizeIframe(event.data.appPath, event.data.height);
        }
        else if (event.data.message === 'notification' && this.additionalConfig.handleNotification) {
            this.additionalConfig.handleNotification(event.data.tag, event.data.data);
        }
    };
    MetaRouter.prototype.resizeIframe = function (appPath, height) {
        var iframe = document.getElementById(appPath);
        if (!iframe)
            return;
        var newHight = Number(height) + this.additionalConfig.additionalHeight;
        iframe.style.height = newHight + 'px';
    };
    MetaRouter.prototype.ensureIframeCreated = function (route, subRoute) {
        if (!this.getIframe(route)) {
            var url = '';
            if (subRoute) {
                url = route.app + '#' + this.additionalConfig.hashPrefix + subRoute;
            }
            else {
                url = route.app;
            }
            var iframe = document.createElement('iframe');
            iframe.style['display'] = 'none';
            iframe.src = url;
            iframe.id = route.path;
            iframe.className = 'outlet-frame';
            var outlet = this.getOutlet(route);
            if (!outlet)
                throw new Error("outlet " + outlet + " not found");
            outlet.appendChild(iframe);
        }
    };
    MetaRouter.prototype.activateRoute = function (routeToActivate, subRoute) {
        var that = this;
        this.routes.forEach(function (route) {
            var iframe = that.getIframe(route);
            if (iframe && route.outlet === routeToActivate.outlet) {
                iframe.style['display'] = route === routeToActivate ? 'block' : 'none';
            }
        });
        if (subRoute) {
            var activatedIframe = this.getIframe(routeToActivate);
            activatedIframe.contentWindow.postMessage({ message: 'sub-route', route: subRoute }, '*');
        }
        this.setRouteInHash(routeToActivate, subRoute);
        this.activatedRoute = routeToActivate;
    };
    MetaRouter.prototype.setRouteInHash = function (routeToActivate, subRoute) {
        var path = routeToActivate.path;
        var currentRoutes = this.parseHash();
        if (subRoute && subRoute.startsWith('/')) {
            subRoute = subRoute.substr(1);
        }
        var hash = '';
        if (subRoute) {
            hash = path + '/' + subRoute;
        }
        else {
            hash = path;
        }
        currentRoutes[routeToActivate.outlet || 'outlet'] = hash;
        history.replaceState(null, null, document.location.pathname + '#' + this.persistUrl(currentRoutes));
    };
    MetaRouter.prototype.parseHash = function () {
        var hash = location.hash.substr(1) + '\0';
        return this.urlParser.parse(hash);
    };
    MetaRouter.prototype.persistUrl = function (routes) {
        var url = '';
        if (routes['outlet']) {
            url = routes['outlet'];
        }
        for (var _i = 0, _a = Object.getOwnPropertyNames(routes); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key !== 'outlet') {
                if (url)
                    url += '//';
                url += key + ':' + routes[key];
            }
        }
        return url;
    };
    MetaRouter.prototype.getIframe = function (route) {
        return document.getElementById(route.path);
    };
    MetaRouter.prototype.getOutlet = function (route) {
        var outlet = route.outlet || 'outlet';
        return document.getElementById(outlet);
    };
    MetaRouter.prototype.routeByUrl = function () {
        if (!location.hash)
            return;
        var path = location.hash.substr(1);
        if (!path)
            return;
        var routes = this.urlParser.parse(path);
        for (var _i = 0, _a = Object.getOwnPropertyNames(routes); _i < _a.length; _i++) {
            var key = _a[_i];
            var route = routes[key];
            var segments = route.split('/');
            var appPath = segments[0];
            var rest = segments.slice(1).join('/');
            this.go(appPath, rest);
        }
    };
    return MetaRouter;
}());
exports.MetaRouter = MetaRouter;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var UrlParser = /** @class */ (function () {
    function UrlParser() {
    }
    UrlParser.prototype.parse = function (url) {
        var key = 'outlet';
        var value = '';
        var depth = 0;
        var state = null;
        var result = {};
        state = 'value';
        url += '\0';
        for (var i = 0; i < url.length; i++) {
            var c = url.substr(i, 1);
            var c2 = url.substr(i, 2);
            switch (state) {
                case 'key':
                    if (c === ':') {
                        state = 'value';
                    }
                    else {
                        key += c;
                    }
                    break;
                case 'value':
                    if (c === '(') {
                        value += c;
                        depth += 1;
                    }
                    else if (c === ')') {
                        value += c;
                        depth -= 1;
                    }
                    else if (depth > 0) {
                        value += c;
                    }
                    else if (c2 === '//') {
                        result[key] = value;
                        key = value = '';
                        state = 'key';
                        i++;
                    }
                    else if (c === '\0') {
                        result[key] = value;
                        key = value = '';
                        state = 'key';
                    }
                    else if (c === ':') {
                        key = value;
                        value = '';
                        state = 'value';
                    }
                    else {
                        value += c;
                    }
                    break;
            }
        }
        return result;
    };
    return UrlParser;
}());
exports.UrlParser = UrlParser;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
/**
 * Represents a micro frontend (a client app) the meta router routes to
 */
var RoutedApp = /** @class */ (function () {
    function RoutedApp() {
    }
    RoutedApp.prototype.config = function (config) {
        this.childConfig = config;
    };
    RoutedApp.prototype.init = function () {
        if (!parent)
            return;
        window.addEventListener('load', this.sendHeight.bind(this), true);
        window.addEventListener('resize', this.sendHeight.bind(this), true);
    };
    /** Sends the current route to the meta router to include it into the url */
    RoutedApp.prototype.sendRoute = function (url) {
        parent.postMessage({ message: 'routed', appPath: this.childConfig.appId, route: url }, '*');
    };
    /** Sends a message to the shell */
    RoutedApp.prototype.notifyShell = function (tag, data) {
        parent.postMessage({ message: 'notification', tag: tag, data: data }, '*');
    };
    /** Sends a message to all routed apps */
    RoutedApp.prototype.broadcast = function (tag, data) {
        parent.postMessage({ message: 'broadcast', tag: tag, data: data }, '*');
    };
    /**
     * Registers a callback that allows the meta router to request
     * a new route within the routed application
    */
    RoutedApp.prototype.registerForRouteChange = function (callback) {
        window.addEventListener('message', function (e) {
            if (e.data && e.data.message === 'sub-route') {
                callback(e.data.route);
            }
        }, true);
    };
    RoutedApp.prototype.sendHeight = function () {
        var html = document.documentElement;
        var height = html.offsetHeight;
        parent.postMessage({ message: 'set-height', appPath: this.childConfig.appId, height: height }, '*');
    };
    return RoutedApp;
}());
exports.RoutedApp = RoutedApp;


/***/ })
/******/ ]);