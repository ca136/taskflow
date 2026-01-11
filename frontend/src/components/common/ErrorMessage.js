"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = void 0;
var react_1 = __importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var ErrorMessage = function (_a) {
    var message = _a.message, _b = _a.title, title = _b === void 0 ? 'Error' : _b, onDismiss = _a.onDismiss, onRetry = _a.onRetry, details = _a.details, _c = _a.fullScreen, fullScreen = _c === void 0 ? false : _c;
    var content = (<div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <lucide_react_1.AlertCircle className="h-6 w-6 text-red-500"/>
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-red-800">{title}</h3>
        <p className="mt-1 text-sm text-red-700">{message}</p>
        {details && <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">{details}</p>}
        <div className="mt-4 flex gap-2">
          {onRetry && (<button onClick={onRetry} className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
              Retry
            </button>)}
          {onDismiss && (<button onClick={onDismiss} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Dismiss
            </button>)}
        </div>
      </div>
      {onDismiss && (<button onClick={onDismiss} className="flex-shrink-0 text-gray-400 hover:text-gray-500">
          <lucide_react_1.X className="h-5 w-5"/>
        </button>)}
    </div>);
    if (fullScreen) {
        return (<div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          {content}
        </div>
      </div>);
    }
    return (<div className="rounded-md bg-red-50 p-4 border border-red-200">
      {content}
    </div>);
};
exports.ErrorMessage = ErrorMessage;
