"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsiveTest = void 0;
var react_1 = require("react");
var Navigation_1 = require("../components/common/Navigation");
var KanbanBoard_1 = require("../components/board/KanbanBoard");
var Modal_1 = require("../components/common/Modal");
var TaskForm_1 = require("../components/common/TaskForm");
/**
 * Responsive Design Test Page
 *
 * This page is designed to test responsive behavior at multiple viewport sizes:
 * - Mobile: 320px (small phones)
 * - Mobile: 375px (standard phones like iPhone)
 * - Tablet: 768px (iPad)
 *
 * Test Coverage:
 * 1. Navigation menu collapses on mobile
 * 2. Kanban board is scrollable on mobile
 * 3. Modals fit on screen and are scrollable if needed
 * 4. Forms are accessible and properly sized
 * 5. Touch-friendly button sizes (min 44px)
 */
var ResponsiveTest = function () {
    var _a = (0, react_1.useState)(false), isTaskModalOpen = _a[0], setIsTaskModalOpen = _a[1];
    var _b = (0, react_1.useState)(false), isInfoModalOpen = _b[0], setIsInfoModalOpen = _b[1];
    var _c = (0, react_1.useState)('full'), viewport = _c[0], setViewport = _c[1];
    var handleCreateTask = function (data) {
        console.log('Task created:', data);
        setIsTaskModalOpen(false);
    };
    // Viewport classes for testing different sizes
    var getViewportClass = function () {
        switch (viewport) {
            case '320px':
                return 'max-w-xs mx-auto';
            case '375px':
                return 'max-w-sm mx-auto';
            case '768px':
                return 'max-w-2xl mx-auto';
            default:
                return 'w-full';
        }
    };
    return (<div className={"flex flex-col h-screen bg-gray-50 ".concat(getViewportClass())}>
      {/* Navigation */}
      <Navigation_1.Navigation />

      {/* Viewport Selector (for testing) */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Test Viewport:</span>
          <div className="flex gap-2 flex-wrap">
            {['full', '320px', '375px', '768px'].map(function (size) { return (<button key={size} onClick={function () { return setViewport(size); }} className={"px-3 py-1 text-sm rounded-md font-medium transition-colors ".concat(viewport === size
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300')} data-testid={"viewport-".concat(size)}>
                {size}
              </button>); })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Responsive Design Test</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Test layout and components at different viewport sizes
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">Test Controls</h2>
            <div className="flex flex-col gap-2">
              <button onClick={function () { return setIsTaskModalOpen(true); }} className="w-full px-3 py-2 sm:w-auto bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium text-sm" data-testid="open-task-modal-btn">
                Open Task Form Modal (Test Modal Fit)
              </button>
              <button onClick={function () { return setIsInfoModalOpen(true); }} className="w-full px-3 py-2 sm:w-auto bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm" data-testid="open-info-modal-btn">
                Open Info Modal (Test Long Content)
              </button>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-6 py-3 text-xs sm:text-sm text-blue-800">
          <strong>Testing:</strong> Navigation menu collapse, Kanban board horizontal scroll, Modal responsive layout,
          Form field sizing, Touch-friendly button sizes
        </div>

        {/* Kanban Board */}
        <KanbanBoard_1.KanbanBoard />
      </main>

      {/* Task Form Modal */}
      <Modal_1.Modal isOpen={isTaskModalOpen} onClose={function () { return setIsTaskModalOpen(false); }} title="Create New Task" data-testid="task-modal">
        <TaskForm_1.TaskForm onSubmit={handleCreateTask}/>
      </Modal_1.Modal>

      {/* Info Modal with Long Content */}
      <Modal_1.Modal isOpen={isInfoModalOpen} onClose={function () { return setIsInfoModalOpen(false); }} title="Responsive Design Test Info" data-testid="info-modal">
        <div className="space-y-4 text-sm text-gray-700">
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Navigation Testing</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Desktop: Menu items displayed horizontally</li>
              <li>Mobile (&lt;768px): Menu collapses into hamburger icon</li>
              <li>Touch-friendly: 44px minimum tap target</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Kanban Board Testing</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Desktop: 3 columns displayed side-by-side</li>
              <li>Mobile (&lt;768px): Single column, horizontal scroll for columns</li>
              <li>Cards are readable at all sizes with proper text wrapping</li>
              <li>Touch-friendly: Sufficient spacing between interactive elements</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Modal Testing</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Mobile: Full width with padding from screen edges</li>
              <li>Desktop: Centered with max-width constraint</li>
              <li>Content scrollable if exceeds available height</li>
              <li>Close button always accessible</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Form Testing</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Input fields full-width on mobile</li>
              <li>Proper spacing for thumb interaction</li>
              <li>Labels and error states visible at all sizes</li>
              <li>Buttons stack vertically on mobile, horizontal on desktop</li>
            </ul>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <h3 className="font-semibold text-yellow-900 mb-1">Browser DevTools Tip</h3>
            <p>
              Use your browser's responsive design mode (F12) to test at specific viewport widths: 320px, 375px, and
              768px. Check the Network tab to monitor performance at different sizes.
            </p>
          </section>
        </div>
      </Modal_1.Modal>
    </div>);
};
exports.ResponsiveTest = ResponsiveTest;
