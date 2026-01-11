"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastContainer = void 0;
var react_1 = __importDefault(require("react"));
var notificationStore_1 = require("../../stores/notificationStore");
var Toast_1 = require("./Toast");
var ToastContainer = function () {
    var notifications = (0, notificationStore_1.useNotificationStore)(function (state) { return state.notifications; });
    var removeNotification = (0, notificationStore_1.useNotificationStore)(function (state) { return state.removeNotification; });
    return (<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {notifications.map(function (notification) { return (<Toast_1.Toast key={notification.id} notification={notification} onClose={removeNotification}/>); })}
    </div>);
};
exports.ToastContainer = ToastContainer;
