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
var core_1 = require("@angular/core");
var app_tokens_1 = require("../app.tokens");
var AComponent = /** @class */ (function () {
    function AComponent(routedApp) {
        this.routedApp = routedApp;
    }
    AComponent.prototype.ngOnInit = function () {
    };
    AComponent.prototype.sendNotification = function () {
        this.routedApp.notifyShell('test', { info: 123 });
        this.routedApp.broadcast('test broadcast', { info: 456 });
    };
    AComponent = __decorate([
        core_1.Component({
            selector: 'app-a',
            templateUrl: './a.component.html',
            styleUrls: ['./a.component.css']
        }),
        __param(0, core_1.Inject(app_tokens_1.ROUTED_APP))
    ], AComponent);
    return AComponent;
}());
exports.AComponent = AComponent;
