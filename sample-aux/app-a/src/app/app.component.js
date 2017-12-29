"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var app_tokens_1 = require("./app.tokens");
var AppComponent = /** @class */ (function () {
    function AppComponent(routedApp, router) {
        this.routedApp = routedApp;
        this.router = router;
        this.title = 'app';
        this.initRoutedApp();
    }
    AppComponent.prototype.initRoutedApp = function () {
        var _this = this;
        this.routedApp.config({ appId: 'a' });
        this.routedApp.init();
        this.router.events.pipe(operators_1.filter(function (e) { return e instanceof router_1.NavigationEnd; })).subscribe(function (e) {
            _this.routedApp.sendRoute(e.url);
        });
        this.routedApp.registerForRouteChange(function (url) { return _this.router.navigateByUrl(url); });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }),
        __param(0, core_1.Inject(app_tokens_1.ROUTED_APP))
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
