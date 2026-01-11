"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Breadcrumbs = void 0;
var lucide_react_1 = require("lucide-react");
var Breadcrumbs = function (_a) {
    var items = _a.items;
    if (items.length === 0)
        return null;
    return (<nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map(function (item, index) {
            var isLast = index === items.length - 1;
            var isFirst = index === 0;
            return (<li key={index} className="flex items-center gap-2">
              {!isFirst && (<lucide_react_1.ChevronRight size={16} className="text-gray-400 flex-shrink-0"/>)}

              {item.href && !isLast ? (<a href={item.href} className="text-indigo-600 hover:text-indigo-700 hover:underline text-sm font-medium transition-colors">
                  {item.label}
                </a>) : (<span className={"text-sm font-medium ".concat(isLast
                        ? 'text-gray-900'
                        : 'text-gray-600')} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>)}
            </li>);
        })}
      </ol>
    </nav>);
};
exports.Breadcrumbs = Breadcrumbs;
