"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLayout = void 0;
var react_1 = require("react");
var Header_1 = require("../common/Header");
var Sidebar_1 = require("../common/Sidebar");
var Breadcrumbs_1 = require("../common/Breadcrumbs");
var AppLayout = function (_a) {
    var children = _a.children, _b = _a.breadcrumbs, breadcrumbs = _b === void 0 ? [] : _b, title = _a.title;
    var _c = (0, react_1.useState)(false), isMobileMenuOpen = _c[0], setIsMobileMenuOpen = _c[1];
    var handleMenuToggle = function (isOpen) {
        setIsMobileMenuOpen(isOpen);
    };
    var handleSidebarClose = function () {
        setIsMobileMenuOpen(false);
    };
    return (<div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header_1.Header onMenuToggle={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen}/>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar_1.Sidebar isOpen={isMobileMenuOpen} onClose={handleSidebarClose}/>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Title */}
            {title && (<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h2>)}

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && <Breadcrumbs_1.Breadcrumbs items={breadcrumbs}/>}

            {/* Page Content */}
            <div className="animate-fadeIn">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>);
};
exports.AppLayout = AppLayout;
