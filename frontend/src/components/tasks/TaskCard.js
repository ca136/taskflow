"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCard = void 0;
var react_1 = require("react");
var TaskCard = function (_a) {
    var task = _a.task, onTaskClick = _a.onTaskClick, onDelete = _a.onDelete;
    var _b = (0, react_1.useState)(false), showDeleteConfirm = _b[0], setShowDeleteConfirm = _b[1];
    var handleDelete = function (e) {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };
    var confirmDelete = function (e) {
        e.stopPropagation();
        if (onDelete) {
            onDelete(task.id);
            setShowDeleteConfirm(false);
        }
    };
    var cancelDelete = function (e) {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };
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
    var priorityLabels = {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
    };
    return (<>
      <div onClick={function () { return onTaskClick(task); }} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-primary-500">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary-600">
            {task.title}
          </h3>

          {/* Description snippet */}
          {task.description && (<p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>)}

          {/* Priority and Assignee */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className={"inline-block px-2 py-1 rounded text-xs font-medium ".concat(getPriorityColor(task.priority))}>
              {priorityLabels[task.priority]}
            </span>

            {task.assignee && (<div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {task.assignee.charAt(0).toUpperCase()}
                </div>
              </div>)}
          </div>

          {/* Delete button */}
          <div className="pt-2 border-t border-gray-100">
            <button onClick={handleDelete} className="text-xs text-gray-500 hover:text-red-600 transition-colors px-2 py-1" title="Delete task">
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Delete Task?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={cancelDelete} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </>);
};
exports.TaskCard = TaskCard;
