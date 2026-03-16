import { useState, FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLabels, createLabel } from '@/services/labels'
import type { Label } from '@/types'
import { COLOR_PALETTE } from '@/constants/colors'

interface Props {
  projectId: string
  selectedLabelIds: string[]
  onToggle: (labelId: string) => void
}

export default function LabelPicker({ projectId, selectedLabelIds, onToggle }: Props) {
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLOR_PALETTE[0])

  const { data: labels } = useQuery({
    queryKey: ['projects', projectId, 'labels'],
    queryFn: () => getLabels(projectId),
  })

  const createMutation = useMutation({
    mutationFn: (data: { name: string; color: string }) => createLabel(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'labels'] })
      setNewName('')
      setShowCreate(false)
    },
  })

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    createMutation.mutate({ name: newName.trim(), color: newColor })
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Labels</p>

      {/* Existing labels */}
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {labels?.map((label: Label) => (
          <button
            key={label.id}
            type="button"
            onClick={() => onToggle(label.id)}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-left hover:bg-gray-50 ${
              selectedLabelIds.includes(label.id) ? 'ring-2 ring-primary-400' : ''
            }`}
          >
            <span
              className="w-8 h-5 rounded shrink-0"
              style={{ backgroundColor: label.color }}
            />
            <span className="flex-1 truncate text-gray-700">{label.name}</span>
            {selectedLabelIds.includes(label.id) && (
              <svg className="w-4 h-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Create new */}
      {showCreate ? (
        <form onSubmit={handleCreate} className="space-y-2 border-t pt-2">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Label name"
            maxLength={50}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex flex-wrap gap-1">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`w-6 h-6 rounded ${newColor === c ? 'ring-2 ring-offset-1 ring-gray-900' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 disabled:opacity-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1 text-xs text-secondary-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="text-xs text-primary-600 hover:text-primary-700"
        >
          + Create new label
        </button>
      )}
    </div>
  )
}
