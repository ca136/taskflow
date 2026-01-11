"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
var react_1 = __importDefault(require("react"));
var ErrorMessage_1 = require("./ErrorMessage");
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.resetError = function () {
            _this.setState({ hasError: false, error: null });
        };
        _this.state = { hasError: false, error: null };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        var _a;
        if (this.state.hasError) {
            return (this.props.fallback || (<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <ErrorMessage_1.ErrorMessage title="Unexpected Error" message={((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || 'Something went wrong. Please try refreshing the page.'} onDismiss={this.resetError}/>
          </div>));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(react_1.default.Component));
exports.ErrorBoundary = ErrorBoundary;
