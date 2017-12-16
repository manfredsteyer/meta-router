"use strict";
exports.__esModule = true;
/**
 * MetaRouter for routing between micro frontends
 */
var MetaRouter = /** @class */ (function () {
    function MetaRouter() {
        this.additionalConfig = {
            hashPrefix: '/',
            additionalHeight: 5
        };
        this.routes = new Array();
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
        var route = this.routes.find(function (route) {
            return route.path === path;
        });
        if (!route)
            throw Error('route not found: ' + route);
        this.ensureIframeCreated(route, subRoute);
        this.activateRoute(route, subRoute);
    };
    MetaRouter.prototype.handleMessage = function (event) {
        if (!event.data)
            return;
        if (event.data.message == 'routed') {
            this.setRouteInHash(event.data.appPath, event.data.route);
        }
        else if (event.data.message == 'set-height') {
            this.resizeIframe(event.data.appPath, event.data.height);
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
            var outlet = this.getOutlet();
            if (!outlet)
                throw new Error('outlet not found');
            outlet.appendChild(iframe);
        }
    };
    MetaRouter.prototype.activateRoute = function (routeToActivate, subRoute) {
        var that = this;
        this.routes.forEach(function (route) {
            var iframe = that.getIframe(route);
            if (iframe) {
                iframe.style['display'] = route === routeToActivate ? 'block' : 'none';
            }
        });
        if (subRoute) {
            var activatedIframe = this.getIframe(routeToActivate);
            activatedIframe.contentWindow.postMessage({ message: 'sub-route', route: subRoute }, '*');
        }
        this.setRouteInHash(routeToActivate.path, subRoute);
        this.activatedRoute = routeToActivate;
    };
    MetaRouter.prototype.setRouteInHash = function (path, subRoute) {
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
        history.replaceState(null, null, document.location.pathname + '#' + hash);
    };
    MetaRouter.prototype.getIframe = function (route) {
        return document.getElementById(route.path);
    };
    MetaRouter.prototype.getOutlet = function () {
        return document.getElementById('outlet');
    };
    MetaRouter.prototype.routeByUrl = function () {
        if (!location.hash)
            return;
        var path = location.hash.substr(1);
        if (!path)
            return;
        var segments = path.split('/');
        var appPath = segments[0];
        var rest = segments.slice(1).join('/');
        this.go(appPath, rest);
    };
    return MetaRouter;
}());
exports.MetaRouter = MetaRouter;
;
