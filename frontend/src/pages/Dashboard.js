"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Navigation_1 = require("../components/common/Navigation");
var KanbanBoard_1 = require("../components/board/KanbanBoard");
var Modal_1 = require("../components/common/Modal");
var TaskForm_1 = require("../components/common/TaskForm");
var Dashboard = function () {
    var _a = (0, react_1.useState)(false), isModalOpen = _a[0], setIsModalOpen = _a[1];
    var handleCreateTask = function (data) {
        console.log('Task created:', data);
        setIsModalOpen(false);
        alert('Task created successfully! (In a real app, this would save to the backend)');
    };
    return (<div className="flex flex-col h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation_1.Navigation />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Manage your tasks and projects</p>
            </div>
            <button onClick={function () { return setIsModalOpen(true); }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium" data-testid="create-task-btn">
              <lucide_react_1.Plus size={20}/>
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard_1.KanbanBoard />
      </main>

      {/* Create Task Modal */}
      <Modal_1.Modal isOpen={isModalOpen} onClose={function () { return setIsModalOpen(false); }} title="Create New Task">
        <TaskForm_1.TaskForm onSubmit={handleCreateTask}/>
      </Modal_1.Modal>
    </div>);
};
exports.Dashboard = Dashboard;
