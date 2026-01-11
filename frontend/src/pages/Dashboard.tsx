import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { KanbanBoard } from '../components/board/KanbanBoard'
import { Modal } from '../components/common/Modal'
import { TaskForm } from '../components/tasks/TaskForm'
import { useProjectStore } from '../stores/projectStore'

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentProject } = useProjectStore()
  const projectId = currentProject?.id || 'default-project'

  const handleTaskCreated = () => {
    setIsModalOpen(false)
  }

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Manage your tasks and projects"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard', current: true },
      ]}
    >
      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium shadow-sm hover:shadow-md"
          data-testid="create-task-btn"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <KanbanBoard />
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm projectId={projectId} onSuccess={handleTaskCreated} />
      </Modal>
    </AppLayout>
  )
}
