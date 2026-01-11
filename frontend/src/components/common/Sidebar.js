"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var projectStore_1 = require("../../stores/projectStore");
var Sidebar = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, projectStore_1.useProjectStore)(), projects = _b.projects, currentProject = _b.currentProject, setCurrentProject = _b.setCurrentProject;
    var _c = (0, react_1.useState)(true), showProjectMenu = _c[0], setShowProjectMenu = _c[1];
    var navItems = [
        { icon: lucide_react_1.LayoutDashboard, label: 'Dashboard', href: '/' },
        { icon: lucide_react_1.CheckSquare, label: 'Tasks', href: '/tasks' },
        { icon: lucide_react_1.Settings, label: 'Settings', href: '/settings' },
    ];
    return (<>
      {/* Mobile Overlay */}
      {isOpen && (<div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={onClose}/>)}

      {/* Sidebar */}
      <aside className={"fixed inset-y-0 left-0 w-64 bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out z-30 lg:static lg:translate-x-0 ".concat(isOpen ? 'translate-x-0' : '-translate-x-full')} style={{ top: '64px' }}>
        <div className="h-full overflow-y-auto flex flex-col">
          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(function (item) {
            var Icon = item.icon;
            return (<a key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-indigo-600 transition-colors group" onClick={function () {
                    if (window.innerWidth < 1024) {
                        onClose();
                    }
                }}>
                  <Icon size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors"/>
                  <span className="font-medium">{item.label}</span>
                </a>);
        })}
          </nav>

          {/* Projects Section */}
          <div className="border-t border-gray-200 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Projects
              </h3>
              <button className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-indigo-600" title="Add project">
                <lucide_react_1.Plus size={16}/>
              </button>
            </div>

            {/* Project List */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {projects.length === 0 ? (<p className="text-xs text-gray-500 px-4 py-2">No projects yet</p>) : (projects.map(function (project) { return (<button key={project.id} onClick={function () {
                setCurrentProject(project);
                if (window.innerWidth < 1024) {
                    onClose();
                }
            }} className={"w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ".concat((currentProject === null || currentProject === void 0 ? void 0 : currentProject.id) === project.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-white')}>
                    <div className="flex items-center justify-between">
                      <span className="truncate">{project.name}</span>
                      {(currentProject === null || currentProject === void 0 ? void 0 : currentProject.id) === project.id && (<div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0"/>)}
                    </div>
                  </button>); }))}
            </div>

            {/* Expand/Collapse Projects */}
            <button onClick={function () { return setShowProjectMenu(!showProjectMenu); }} className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-700 py-2 transition-colors">
              <lucide_react_1.ChevronDown size={14}/>
              {showProjectMenu ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
      </aside>
    </>);
};
exports.Sidebar = Sidebar;
