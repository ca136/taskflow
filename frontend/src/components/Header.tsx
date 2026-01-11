interface HeaderProps {
  taskCount?: number
  onAddTask?: () => void
}

export default function Header({ taskCount = 0, onAddTask }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left: Title and Task Summary */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              TaskFlow
            </h1>
            <p className="text-blue-100 text-sm font-medium">
              {taskCount} task{taskCount !== 1 ? 's' : ''} to track
            </p>
          </div>

          {/* Right: Add Task Button */}
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            aria-label="Add new task"
          >
            {/* Plus Icon */}
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  )
}
