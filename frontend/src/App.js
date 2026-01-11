"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var common_1 = require("./components/common");
var Dashboard_1 = require("./pages/Dashboard");
var ResponsiveTest_1 = require("./pages/ResponsiveTest");
function App() {
    return (<common_1.ErrorBoundary>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<Dashboard_1.Dashboard />}/>
          <react_router_dom_1.Route path="/responsive-test" element={<ResponsiveTest_1.ResponsiveTest />}/>
        </react_router_dom_1.Routes>
        <common_1.ToastContainer />
      </react_router_dom_1.BrowserRouter>
    </common_1.ErrorBoundary>);
}
exports.default = App;
