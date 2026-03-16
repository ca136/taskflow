import { useState, FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '@/services/tasks'

interface Props {
  boardId: string
}

export default function CreateTaskForm({ boardId }: Props) {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  const mutation = useMutation({
    mutationFn: (data: { title: string; priority: string }) => createTask(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId, 'tasks'] })
      setTitle('')
      setPriority('medium')
      setExpanded(false)
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    mutation.mutate({ title: title.trim(), priority })
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="mt-2 w-full text-sm text-secondary-500 hover:text-gray-900 py-1.5 rounded hover:bg-gray-200 transition-colors"
      >
        + Add task
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <input
        autoFocus
        type="text"
        required
        maxLength={300}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="Task title"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Adding...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={() => { setExpanded(false); setTitle(''); setPriority('medium') }}
          className="px-3 py-1.5 text-sm text-secondary-500 hover:text-gray-900 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
