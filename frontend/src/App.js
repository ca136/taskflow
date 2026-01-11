"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var layout_1 = require("./components/layout");
function App() {
    return (<react_router_dom_1.BrowserRouter>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/" element={<layout_1.AppLayout title="Dashboard" breadcrumbs={[
                { label: 'Home', href: '/', current: false },
                { label: 'Dashboard', current: true },
            ]}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                  <p className="mt-2 text-sm text-gray-600">Manage your projects</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                  <p className="mt-2 text-sm text-gray-600">Track your tasks</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Team</h3>
                  <p className="mt-2 text-sm text-gray-600">Manage your team</p>
                </div>
              </div>
            </layout_1.AppLayout>}/>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>);
}
exports.default = App;
