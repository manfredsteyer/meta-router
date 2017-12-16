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
