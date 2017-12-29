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
        app: '/app-a/dist'
    },
    {
        path: 'b',
        app: '/app-b/dist',
        outlet: 'outlet2'
    }
];

window.addEventListener('load', function() { 

    var router = new MetaRouter();
    router.config(config);
    router.init();
    router.preload();

    // Here we could load additional routes to additional outlets
    // router.go('b'); // put sth into outlet2


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

(function (global, factory) {
	 true ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['meta-router'] = {})));
}(this, (function (exports) { 'use strict';

var UrlParser = (function () {
    function UrlParser() {
    }
    /**
     * @param {?} url
     * @return {?}
     */
    UrlParser.prototype.parse = function (url) {
        var /** @type {?} */ key = 'outlet';
        var /** @type {?} */ value = '';
        var /** @type {?} */ depth = 0;
        var /** @type {?} */ state = null;
        var /** @type {?} */ result = {};
        state = 'value';
        url += '\0';
        for (var /** @type {?} */ i = 0; i < url.length; i++) {
            var /** @type {?} */ c = url.substr(i, 1);
            var /** @type {?} */ c2 = url.substr(i, 2);
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

/**
 * MetaRouter for routing between micro frontends
 */
var MetaRouter = (function () {
    function MetaRouter() {
        this.additionalConfig = {
            hashPrefix: '/',
            additionalHeight: 5
        };
        this.routes = new Array();
        this.urlParser = new UrlParser();
    }
    /**
     * @param {?} routes
     * @return {?}
     */
    MetaRouter.prototype.config = function (routes) { this.routes = routes; };
    /**
     * initializes the router after configuring it
     * @return {?}
     */
    MetaRouter.prototype.init = function () {
        window.addEventListener('hashchange', this.routeByUrl.bind(this), false);
        window.addEventListener('message', this.handleMessage.bind(this), false);
        if (!location.hash && this.routes && this.routes.length > 0) {
            var /** @type {?} */ defaultRoute = this.routes[0];
            this.go(defaultRoute.path);
        }
        else {
            this.routeByUrl();
        }
    };
    /**
     * Preloads all the micro frontends by loading them into the page
     * @return {?}
     */
    MetaRouter.prototype.preload = function () {
        var _this = this;
        this.routes.forEach(function (route) {
            _this.ensureIframeCreated(route);
        });
    };
    /**
     * Navigates to a configured meta route
    \@param path path of the routed client app
    \@param subRoute subRoute passed to the client app
     * @param {?} path
     * @param {?=} subRoute
     * @return {?}
     */
    MetaRouter.prototype.go = function (path, subRoute) {
        var /** @type {?} */ route = this.routes.find(function (r) {
            return r.path === path;
        });
        if (!route)
            throw Error('route not found: ' + route);
        this.ensureIframeCreated(route, subRoute);
        this.activateRoute(route, subRoute);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MetaRouter.prototype.handleMessage = function (event) {
        if (!event.data)
            return;
        if (event.data.message === 'routed') {
            var /** @type {?} */ route = this.routes.find(function (r) { return r.path === event.data.appPath; });
            this.setRouteInHash(route, event.data.route);
        }
        else if (event.data.message === 'set-height') {
            this.resizeIframe(event.data.appPath, event.data.height);
        }
    };
    /**
     * @param {?} appPath
     * @param {?} height
     * @return {?}
     */
    MetaRouter.prototype.resizeIframe = function (appPath, height) {
        var /** @type {?} */ iframe = document.getElementById(appPath);
        if (!iframe)
            return;
        var /** @type {?} */ newHight = Number(height) + this.additionalConfig.additionalHeight;
        iframe.style.height = newHight + 'px';
    };
    /**
     * @param {?} route
     * @param {?=} subRoute
     * @return {?}
     */
    MetaRouter.prototype.ensureIframeCreated = function (route, subRoute) {
        if (!this.getIframe(route)) {
            var /** @type {?} */ url = '';
            if (subRoute) {
                url = route.app + '#' + this.additionalConfig.hashPrefix + subRoute;
            }
            else {
                url = route.app;
            }
            var /** @type {?} */ iframe = document.createElement('iframe');
            iframe.style['display'] = 'none';
            iframe.src = url;
            iframe.id = route.path;
            iframe.className = 'outlet-frame';
            var /** @type {?} */ outlet = this.getOutlet(route);
            if (!outlet)
                throw new Error("outlet " + outlet + " not found");
            outlet.appendChild(iframe);
        }
    };
    /**
     * @param {?} routeToActivate
     * @param {?=} subRoute
     * @return {?}
     */
    MetaRouter.prototype.activateRoute = function (routeToActivate, subRoute) {
        var /** @type {?} */ that = this;
        this.routes.forEach(function (route) {
            var /** @type {?} */ iframe = that.getIframe(route);
            if (iframe && route.outlet === routeToActivate.outlet) {
                iframe.style['display'] = route === routeToActivate ? 'block' : 'none';
            }
        });
        if (subRoute) {
            var /** @type {?} */ activatedIframe = (this.getIframe(routeToActivate));
            activatedIframe.contentWindow.postMessage({ message: 'sub-route', route: subRoute }, '*');
        }
        this.setRouteInHash(routeToActivate, subRoute);
        this.activatedRoute = routeToActivate;
    };
    /**
     * @param {?} routeToActivate
     * @param {?=} subRoute
     * @return {?}
     */
    MetaRouter.prototype.setRouteInHash = function (routeToActivate, subRoute) {
        var /** @type {?} */ path = routeToActivate.path;
        var /** @type {?} */ currentRoutes = this.parseHash();
        if (subRoute && subRoute.startsWith('/')) {
            subRoute = subRoute.substr(1);
        }
        var /** @type {?} */ hash = '';
        if (subRoute) {
            hash = path + '/' + subRoute;
        }
        else {
            hash = path;
        }
        currentRoutes[routeToActivate.outlet || 'outlet'] = hash;
        history.replaceState(null, null, document.location.pathname + '#' + this.persistUrl(currentRoutes));
    };
    /**
     * @return {?}
     */
    MetaRouter.prototype.parseHash = function () {
        var /** @type {?} */ hash = location.hash.substr(1) + '\0';
        return this.urlParser.parse(hash);
    };
    /**
     * @param {?} routes
     * @return {?}
     */
    MetaRouter.prototype.persistUrl = function (routes) {
        var /** @type {?} */ url = '';
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
    /**
     * @param {?} route
     * @return {?}
     */
    MetaRouter.prototype.getIframe = function (route) {
        return (document.getElementById(route.path));
    };
    /**
     * @param {?} route
     * @return {?}
     */
    MetaRouter.prototype.getOutlet = function (route) {
        var /** @type {?} */ outlet = route.outlet || 'outlet';
        return (document.getElementById(outlet));
    };
    /**
     * @return {?}
     */
    MetaRouter.prototype.routeByUrl = function () {
        if (!location.hash)
            return;
        var /** @type {?} */ path = location.hash.substr(1);
        if (!path)
            return;
        var /** @type {?} */ routes = this.urlParser.parse(path);
        for (var _i = 0, _a = Object.getOwnPropertyNames(routes); _i < _a.length; _i++) {
            var key = _a[_i];
            var /** @type {?} */ route = routes[key];
            var /** @type {?} */ segments = route.split('/');
            var /** @type {?} */ appPath = segments[0];
            var /** @type {?} */ rest = segments.slice(1).join('/');
            this.go(appPath, rest);
        }
    };
    return MetaRouter;
}());

/**
 * Represents a micro frontend (a client app) the meta router routes to
 */
var RoutedApp = (function () {
    function RoutedApp() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    RoutedApp.prototype.config = function (config) {
        this.childConfig = config;
    };
    /**
     * @return {?}
     */
    RoutedApp.prototype.init = function () {
        if (!parent)
            return;
        window.addEventListener('load', this.sendHeight.bind(this), true);
        window.addEventListener('resize', this.sendHeight.bind(this), true);
    };
    /**
     * Sends the current route to the meta router to include it into the url
     * @param {?} url
     * @return {?}
     */
    RoutedApp.prototype.sendRoute = function (url) {
        parent.postMessage({ message: 'routed', appPath: this.childConfig.appId, route: url }, '*');
    };
    /**
     * Registers a callback that allows the meta router to request
    a new route within the routed application
     * @param {?} callback
     * @return {?}
     */
    RoutedApp.prototype.registerForRouteChange = function (callback) {
        window.addEventListener('message', function (e) {
            if (e.data && e.data.message === 'sub-route') {
                callback(e.data.route);
            }
        }, true);
    };
    /**
     * @return {?}
     */
    RoutedApp.prototype.sendHeight = function () {
        var /** @type {?} */ html = document.documentElement;
        var /** @type {?} */ height = html.offsetHeight;
        parent.postMessage({ message: 'set-height', appPath: this.childConfig.appId, height: height }, '*');
    };
    return RoutedApp;
}());

exports.MetaRouter = MetaRouter;
exports.RoutedApp = RoutedApp;

Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ })
/******/ ]);