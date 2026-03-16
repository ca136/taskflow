import { useState, FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, createComment, deleteComment } from '@/services/comments'

interface Props {
  taskId: string
}

export default function CommentsSection({ taskId }: Props) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')

  const { data: comments, isLoading } = useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: () => getComments(taskId),
  })

  const addMutation = useMutation({
    mutationFn: (text: string) => createComment(taskId, { content: text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] })
      setContent('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] })
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    addMutation.mutate(content.trim())
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Comments</p>

      {isLoading ? (
        <p className="text-xs text-secondary-500">Loading comments...</p>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 group">
              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium shrink-0">
                {comment.author_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.author_name || 'Unknown'}
                  </span>
                  <span className="text-xs text-secondary-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(comment.id)}
                    className="text-xs text-secondary-500 hover:text-red-600 opacity-0 group-hover:opacity-100 ml-auto"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-secondary-500">No comments yet.</p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={addMutation.isPending || !content.trim()}
          className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
