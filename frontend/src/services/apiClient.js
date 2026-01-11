"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
var axios_1 = __importDefault(require("axios"));
var ApiClient = /** @class */ (function () {
    function ApiClient(baseURL) {
        if (baseURL === void 0) { baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'; }
        var _this = this;
        this.errorCallbacks = [];
        this.client = axios_1.default.create({
            baseURL: baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add request interceptor for auth
        this.client.interceptors.request.use(function (config) {
            var token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = "Bearer ".concat(token);
            }
            return config;
        });
        // Add response interceptor for error handling
        this.client.interceptors.response.use(function (response) { return response; }, function (error) {
            var apiError = _this.handleError(error);
            _this.errorCallbacks.forEach(function (cb) { return cb(apiError); });
            return Promise.reject(apiError);
        });
    }
    ApiClient.prototype.handleError = function (error) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var apiError = {
            message: 'An error occurred',
            status: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500,
        };
        if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
            apiError.message = 'Session expired. Please login again.';
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        else if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 403) {
            apiError.message = 'You do not have permission to perform this action.';
        }
        else if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 404) {
            apiError.message = 'Resource not found.';
        }
        else if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 422) {
            apiError.message = 'Validation error.';
            apiError.details = (_f = error.response.data) === null || _f === void 0 ? void 0 : _f.detail;
        }
        else if (((_g = error.response) === null || _g === void 0 ? void 0 : _g.status) === 500) {
            apiError.message = 'Server error. Please try again later.';
        }
        else if (error.code === 'ECONNABORTED') {
            apiError.message = 'Request timeout. Please check your connection.';
        }
        else if (error.message === 'Network Error') {
            apiError.message = 'Network error. Please check your internet connection.';
        }
        else if ((_h = error.response) === null || _h === void 0 ? void 0 : _h.data) {
            apiError.message = ((_j = error.response.data) === null || _j === void 0 ? void 0 : _j.message) || error.message;
        }
        else {
            apiError.message = error.message || 'An unexpected error occurred';
        }
        return apiError;
    };
    ApiClient.prototype.onError = function (callback) {
        var _this = this;
        this.errorCallbacks.push(callback);
        return function () {
            _this.errorCallbacks = _this.errorCallbacks.filter(function (cb) { return cb !== callback; });
        };
    };
    ApiClient.prototype.get = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get(url, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                            }];
                }
            });
        });
    };
    ApiClient.prototype.post = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post(url, data, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                            }];
                }
            });
        });
    };
    ApiClient.prototype.put = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.put(url, data, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                            }];
                }
            });
        });
    };
    ApiClient.prototype.patch = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.patch(url, data, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                            }];
                }
            });
        });
    };
    ApiClient.prototype.delete = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.delete(url, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                            }];
                }
            });
        });
    };
    return ApiClient;
}());
exports.apiClient = new ApiClient();
