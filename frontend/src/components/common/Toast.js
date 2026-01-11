"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = void 0;
var react_1 = __importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var Toast = function (_a) {
    var notification = _a.notification, onClose = _a.onClose;
    var getIcon = function () {
        switch (notification.type) {
            case 'success':
                return <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500"/>;
            case 'error':
                return <lucide_react_1.AlertCircle className="h-5 w-5 text-red-500"/>;
            case 'warning':
                return <lucide_react_1.AlertTriangle className="h-5 w-5 text-yellow-500"/>;
            case 'info':
                return <lucide_react_1.Info className="h-5 w-5 text-blue-500"/>;
        }
    };
    var getBgColor = function () {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
        }
    };
    var getTextColor = function () {
        switch (notification.type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'info':
                return 'text-blue-800';
        }
    };
    return (<div className={"flex items-start gap-3 ".concat(getBgColor(), " border rounded-lg p-4 shadow-lg transition-all")} role="alert">
      {getIcon()}
      <div className="flex-grow">
        <p className={"text-sm font-medium ".concat(getTextColor())}>{notification.message}</p>
        {notification.action && (<button onClick={notification.action.onClick} className={"text-xs font-medium mt-2 ".concat(getTextColor(), " hover:opacity-75 transition-opacity")}>
            {notification.action.label}
          </button>)}
      </div>
      <button onClick={function () { return onClose(notification.id); }} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
        <lucide_react_1.X className="h-4 w-4"/>
      </button>
    </div>);
};
exports.Toast = Toast;
