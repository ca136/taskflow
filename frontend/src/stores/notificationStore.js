"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = exports.useNotificationStore = void 0;
var zustand_1 = require("zustand");
exports.useNotificationStore = (0, zustand_1.create)(function (set) { return ({
    notifications: [],
    addNotification: function (notification) {
        var id = "".concat(Date.now(), "-").concat(Math.random());
        set(function (state) { return ({
            notifications: __spreadArray(__spreadArray([], state.notifications, true), [__assign(__assign({}, notification), { id: id })], false),
        }); });
        // Auto-remove after duration (default 5 seconds)
        var duration = notification.duration || 5000;
        if (duration > 0) {
            setTimeout(function () {
                set(function (state) { return ({
                    notifications: state.notifications.filter(function (n) { return n.id !== id; }),
                }); });
            }, duration);
        }
        return id;
    },
    removeNotification: function (id) {
        set(function (state) { return ({
            notifications: state.notifications.filter(function (n) { return n.id !== id; }),
        }); });
    },
    clearNotifications: function () {
        set({ notifications: [] });
    },
}); });
// Utility functions for common notification types
var useToast = function () {
    var addNotification = (0, exports.useNotificationStore)(function (state) { return state.addNotification; });
    return {
        success: function (message, duration) {
            return addNotification({ message: message, type: 'success', duration: duration });
        },
        error: function (message, duration) {
            return addNotification({ message: message, type: 'error', duration: duration || 7000 });
        },
        warning: function (message, duration) {
            return addNotification({ message: message, type: 'warning', duration: duration });
        },
        info: function (message, duration) {
            return addNotification({ message: message, type: 'info', duration: duration });
        },
    };
};
exports.useToast = useToast;
