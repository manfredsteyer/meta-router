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
        if (!config.handleNotification) {
            config.handleNotification = function () { };
        }
        if (!config.allowedOrigins) {
            config.allowedOrigins = '*';
        }
        else if (config.allowedOrigins === 'same-origin') {
            config.allowedOrigins = location.origin;
        }
    };
    RoutedApp.prototype.init = function () {
        if (!parent)
            return;
        window.addEventListener('load', this.sendHeight.bind(this), true);
        window.addEventListener('resize', this.sendHeight.bind(this), true);
    };
    /** Sends the current route to the meta router to include it into the url */
    RoutedApp.prototype.sendRoute = function (url) {
        parent.postMessage({ message: 'routed', appPath: this.childConfig.appId, route: url }, this.childConfig.allowedOrigins);
    };
    /** Sends a message to the shell */
    RoutedApp.prototype.notifyShell = function (tag, data) {
        parent.postMessage({ message: 'notification', tag: tag, data: data }, this.childConfig.allowedOrigins);
    };
    /** Sends a message to all routed apps */
    RoutedApp.prototype.broadcast = function (tag, data) {
        parent.postMessage({ message: 'broadcast', tag: tag, data: data }, this.childConfig.allowedOrigins);
    };
    /**
     * Registers a callback that allows the meta router to request
     * a new route within the routed application
    */
    RoutedApp.prototype.registerForRouteChange = function (callback) {
        var _this = this;
        window.addEventListener('message', function (e) {
            if (e.data && e.data.message === 'sub-route') {
                callback(e.data.route);
            }
            else if (e.data.message === 'notification' && _this.childConfig.handleNotification) {
                _this.childConfig.handleNotification(e.data.tag, e.data.data);
            }
        }, true);
    };
    RoutedApp.prototype.sendHeight = function () {
        var html = document.documentElement;
        var height = html.offsetHeight;
        parent.postMessage({ message: 'set-height', appPath: this.childConfig.appId, height: height }, this.childConfig.allowedOrigins);
    };
    return RoutedApp;
}());
exports.RoutedApp = RoutedApp;
