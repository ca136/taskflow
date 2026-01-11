interface HeaderProps {
  onAddTask?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onAddTask }) => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md">
              <span className="text-primary-600 font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              TaskFlow
            </h1>
          </div>

          {/* Add Task Button */}
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.5 1.5H9.5V9.5H1.5v1h8V18.5h1v-8h8v-1h-8V1.5z" />
            </svg>
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
