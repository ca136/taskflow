"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanBoard = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var INITIAL_COLUMNS = [
    {
        id: 'todo',
        title: 'To Do',
        tasks: [
            { id: '1', title: 'Setup project', description: 'Initial project setup', priority: 'high' },
            { id: '2', title: 'Create database schema', description: 'PostgreSQL schema design', priority: 'high' },
            { id: '3', title: 'Write API tests', description: 'Unit and integration tests', priority: 'medium' },
        ],
    },
    {
        id: 'inprogress',
        title: 'In Progress',
        tasks: [
            { id: '4', title: 'Implement authentication', description: 'JWT auth flow', priority: 'high' },
            { id: '5', title: 'Build kanban UI', description: 'React components', priority: 'high' },
        ],
    },
    {
        id: 'done',
        title: 'Done',
        tasks: [
            { id: '6', title: 'Project plan', description: 'Requirements and timeline', priority: 'high' },
            { id: '7', title: 'Design mockups', description: 'UI/UX designs', priority: 'medium' },
        ],
    },
];
var getPriorityColor = function (priority) {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
var KanbanBoard = function () {
    var _a = (0, react_1.useState)(INITIAL_COLUMNS), columns = _a[0], setColumns = _a[1];
    return (<div className="flex-1 overflow-x-auto bg-gray-50 p-4 md:p-6">
      {/* Grid layout that stacks on mobile and becomes horizontal on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-w-max md:min-w-0">
        {columns.map(function (column) { return (<div key={column.id} className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" data-testid={"column-".concat(column.id)}>
            {/* Column Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{column.title}</h2>
                <span className="bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" data-testid={"tasks-".concat(column.id)}>
              {column.tasks.map(function (task) { return (<div key={task.id} className="bg-white border border-gray-200 rounded-md p-3 cursor-move hover:shadow-md transition-shadow" data-testid={"task-".concat(task.id)}>
                  <h3 className="font-medium text-gray-800 text-sm break-words">{task.title}</h3>
                  {task.description && (<p className="text-gray-600 text-xs mt-1 break-words">{task.description}</p>)}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {task.priority && (<span className={"text-xs px-2 py-1 rounded ".concat(getPriorityColor(task.priority))}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>)}
                    {task.assignee && (<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate">
                        {task.assignee}
                      </span>)}
                  </div>
                </div>); })}

              {/* Add Task Button */}
              <button className="w-full mt-2 py-2 px-3 rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-1 text-sm transition-colors" data-testid={"add-task-".concat(column.id)}>
                <lucide_react_1.Plus size={16}/>
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>); })}
      </div>

      {/* Mobile instructions */}
      <div className="md:hidden mt-4 text-center text-gray-600 text-sm">
        <p>Scroll horizontally to view all columns →</p>
      </div>
    </div>);
};
exports.KanbanBoard = KanbanBoard;
