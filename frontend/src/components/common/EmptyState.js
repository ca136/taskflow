"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = void 0;
var react_1 = __importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var EmptyState = function (_a) {
    var _b = _a.icon, icon = _b === void 0 ? <lucide_react_1.Inbox className="w-12 h-12 text-gray-400"/> : _b, title = _a.title, description = _a.description, action = _a.action;
    return (<div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {action && (<button onClick={action.onClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          {action.label}
        </button>)}
    </div>);
};
exports.EmptyState = EmptyState;
