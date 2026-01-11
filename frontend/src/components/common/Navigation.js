"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Navigation = function () {
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var toggleMenu = function () {
        setIsOpen(!isOpen);
    };
    return (<nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">TaskFlow</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium">
              Projects
            </a>
            <a href="#" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium">
              Settings
            </a>
            <button className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md text-sm font-medium">
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-700 focus:outline-none" data-testid="mobile-menu-btn">
              {isOpen ? <lucide_react_1.X size={24}/> : <lucide_react_1.Menu size={24}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (<div className="md:hidden bg-primary-700" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </a>
            <a href="#" className="block hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Projects
            </a>
            <a href="#" className="block hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Settings
            </a>
            <button className="w-full text-left hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Sign Out
            </button>
          </div>
        </div>)}
    </nav>);
};
exports.Navigation = Navigation;
