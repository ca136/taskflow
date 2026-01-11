import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Navigation } from '../components/common/Navigation'
import { KanbanBoard } from '../components/board/KanbanBoard'
import { Modal } from '../components/common/Modal'
import { TaskForm } from '../components/common/TaskForm'

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateTask = (data: any) => {
    console.log('Task created:', data)
    setIsModalOpen(false)
    alert('Task created successfully! (In a real app, this would save to the backend)')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Manage your tasks and projects</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              data-testid="create-task-btn"
            >
              <Plus size={20} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard />
      </main>

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreateTask} />
      </Modal>
    </div>
  )
}
