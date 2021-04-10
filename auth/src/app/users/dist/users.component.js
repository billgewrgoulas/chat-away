"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersComponent = void 0;
var core_1 = require("@angular/core");
var UsersComponent = /** @class */ (function () {
    function UsersComponent(userService) {
        this.userService = userService;
        this.usersList = []; //if we have objects
        this.observers = [];
    }
    UsersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.observers.push(this.userService.getAll('usersAll').subscribe(function (res) {
            _this.usersList = res.users;
        }));
    };
    UsersComponent.prototype.ngOnDestroy = function () {
        this.observers.forEach(function (observer) {
            observer.unsubscribe();
        });
    };
    Object.defineProperty(UsersComponent.prototype, "all", {
        get: function () {
            return this.usersList;
        },
        enumerable: false,
        configurable: true
    });
    UsersComponent = __decorate([
        core_1.Component({
            selector: 'app-users',
            templateUrl: './users.component.html',
            styleUrls: ['./users.component.css']
        })
    ], UsersComponent);
    return UsersComponent;
}());
exports.UsersComponent = UsersComponent;
