import { useState } from 'react'

interface TaskFormProps {
  onSubmit: (data: FormData) => void
}

interface FormData {
  title: string
  description: string
  assignee: string
  priority: 'low' | 'medium' | 'high'
}

export const TaskForm = ({ onSubmit }: TaskFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ title: '', description: '', assignee: '', priority: 'medium' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="task-form">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          data-testid="form-title"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none"
          data-testid="form-description"
        />
      </div>

      {/* Assignee */}
      <div>
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
          Assign To
        </label>
        <input
          id="assignee"
          type="text"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          placeholder="Team member name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          data-testid="form-assignee"
        />
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          data-testid="form-priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 sm:flex-initial px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
          data-testid="form-submit"
        >
          Create Task
        </button>
        <button
          type="reset"
          className="flex-1 sm:flex-initial px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors font-medium"
          data-testid="form-reset"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
