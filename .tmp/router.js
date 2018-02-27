"use strict";
exports.__esModule = true;
var url_parser_1 = require("./url-parser");
/**
 * MetaRouter for routing between micro frontends
 */
var MetaRouter = /** @class */ (function () {
    function MetaRouter() {
        this.additionalConfig = {
            hashPrefix: '/',
            additionalHeight: 5,
            handleNotification: function () { },
            allowedOrigins: '*'
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
        if (this.additionalConfig.allowedOrigins === 'same-origin'
            && event.origin !== location.origin) {
            throw new Error('Received message from not allowed origin');
        }
        else if (this.additionalConfig.allowedOrigins !== '*') {
            var whiteList = this.additionalConfig.allowedOrigins.split(';');
            if (whiteList.indexOf(event.origin) === -1) {
                throw new Error('Received message from not allowed origin');
            }
        }
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
        else if (event.data.message === 'broadcast') {
            for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
                var route = _a[_i];
                var iframe = this.getIframe(route);
                if (iframe) {
                    iframe.contentWindow.postMessage({ message: 'notification', tag: event.data.tag, data: event.data.data }, '*');
                }
            }
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
