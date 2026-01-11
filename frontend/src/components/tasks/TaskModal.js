"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModal = void 0;
var react_1 = require("react");
var TaskModal = function (_a) {
    var task = _a.task, isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave, onDelete = _a.onDelete, _b = _a.users, users = _b === void 0 ? [] : _b, _c = _a.isEditing, isEditing = _c === void 0 ? false : _c, setIsEditing = _a.setIsEditing;
    var _d = (0, react_1.useState)(null), formData = _d[0], setFormData = _d[1];
    var _e = (0, react_1.useState)(false), showDeleteConfirm = _e[0], setShowDeleteConfirm = _e[1];
    // Sync form data when task changes
    (0, react_1.useEffect)(function () {
        if (task) {
            setFormData(__assign({}, task));
        }
    }, [task, isOpen]);
    if (!isOpen || !task || !formData) {
        return null;
    }
    var handleClose = function () {
        setShowDeleteConfirm(false);
        if (setIsEditing)
            setIsEditing(false);
        onClose();
    };
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (prev ? __assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)) : null);
        });
    };
    var handleSave = function () {
        if (formData && onSave) {
            onSave(formData);
            if (setIsEditing)
                setIsEditing(false);
            handleClose();
        }
    };
    var handleDeleteClick = function () {
        setShowDeleteConfirm(true);
    };
    var confirmDelete = function () {
        if (onDelete) {
            onDelete(task.id);
            setShowDeleteConfirm(false);
            handleClose();
        }
    };
    var getPriorityColor = function (priority) {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };
    var statusLabels = {
        todo: 'To Do',
        'in-progress': 'In Progress',
        done: 'Done',
    };
    var priorityLabels = {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };
    var selectedAssignee = users.find(function (u) { return u.id === formData.assignee; });
    return (<>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose}/>

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8" onClick={function (e) { return e.stopPropagation(); }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Task' : 'Task Details'}</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none" title="Close">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              {isEditing ? (<input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"/>) : (<p className="text-gray-900 font-medium">{formData.title}</p>)}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              {isEditing ? (<textarea name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="Add a description..." rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"/>) : (<p className="text-gray-600 whitespace-pre-wrap">{formData.description || 'No description'}</p>)}
            </div>

            {/* Status, Priority, Assignee - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                {isEditing ? (<select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                    <option value="todo">{statusLabels.todo}</option>
                    <option value="in-progress">{statusLabels['in-progress']}</option>
                    <option value="done">{statusLabels.done}</option>
                  </select>) : (<div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {statusLabels[formData.status]}
                  </div>)}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                {isEditing ? (<select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                    <option value="low">{priorityLabels.low}</option>
                    <option value="medium">{priorityLabels.medium}</option>
                    <option value="high">{priorityLabels.high}</option>
                  </select>) : (<div className={"inline-block px-3 py-1 rounded-full text-sm font-medium ".concat(getPriorityColor(formData.priority))}>
                    {priorityLabels[formData.priority]}
                  </div>)}
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee</label>
                {isEditing ? (<select name="assignee" value={formData.assignee || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                    <option value="">Unassigned</option>
                    {users.map(function (user) { return (<option key={user.id} value={user.id}>
                        {user.name}
                      </option>); })}
                  </select>) : (<div className="flex items-center gap-2">
                    {selectedAssignee ? (<>
                        <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {selectedAssignee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900 font-medium">{selectedAssignee.name}</span>
                      </>) : (<span className="text-gray-500">Unassigned</span>)}
                  </div>)}
              </div>
            </div>

            {/* Metadata */}
            {!isEditing && (<div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Created</p>
                  <p className="text-sm text-gray-900">{formatDate(formData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Updated</p>
                  <p className="text-sm text-gray-900">{formatDate(formData.updatedAt)}</p>
                </div>
              </div>)}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button onClick={handleDeleteClick} className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium" title="Delete task">
              Delete
            </button>

            <div className="flex gap-3">
              {isEditing && (<button onClick={function () {
                if (setIsEditing)
                    setIsEditing(false);
                setFormData(__assign({}, task));
            }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">
                  Cancel
                </button>)}

              {!isEditing ? (<button onClick={function () {
                if (setIsEditing)
                    setIsEditing(true);
            }} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Edit
                </button>) : (<button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Save
                </button>)}
            </div>
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
                <button onClick={function () { return setShowDeleteConfirm(false); }} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
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
exports.TaskModal = TaskModal;
