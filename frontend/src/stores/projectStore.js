"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProjectStore = void 0;
var zustand_1 = require("zustand");
exports.useProjectStore = (0, zustand_1.create)(function (set) { return ({
    projects: [],
    currentProject: null,
    setProjects: function (projects) { return set({ projects: projects }); },
    setCurrentProject: function (project) { return set({ currentProject: project }); },
}); });
