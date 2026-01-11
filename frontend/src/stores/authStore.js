"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
var zustand_1 = require("zustand");
exports.useAuthStore = (0, zustand_1.create)(function (set) { return ({
    user: null,
    isLoading: false,
    setUser: function (user) { return set({ user: user }); },
    logout: function () { return set({ user: null }); },
    setLoading: function (loading) { return set({ isLoading: loading }); },
}); });
