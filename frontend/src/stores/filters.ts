import { create } from 'zustand'

interface FilterState {
  searchText: string
  priorities: string[]
  labelIds: string[]
  dueDateFilter: string // '' | 'overdue' | 'due_this_week' | 'no_date'
  assigneeId: string | null

  setSearchText: (text: string) => void
  togglePriority: (priority: string) => void
  toggleLabel: (labelId: string) => void
  setDueDateFilter: (filter: string) => void
  setAssignee: (id: string | null) => void
  clearAll: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  searchText: '',
  priorities: [],
  labelIds: [],
  dueDateFilter: '',
  assigneeId: null,

  setSearchText: (text) => set({ searchText: text }),
  togglePriority: (priority) =>
    set((state) => ({
      priorities: state.priorities.includes(priority)
        ? state.priorities.filter((p) => p !== priority)
        : [...state.priorities, priority],
    })),
  toggleLabel: (labelId) =>
    set((state) => ({
      labelIds: state.labelIds.includes(labelId)
        ? state.labelIds.filter((id) => id !== labelId)
        : [...state.labelIds, labelId],
    })),
  setDueDateFilter: (filter) => set({ dueDateFilter: filter }),
  setAssignee: (id) => set({ assigneeId: id }),
  clearAll: () =>
    set({
      searchText: '',
      priorities: [],
      labelIds: [],
      dueDateFilter: '',
      assigneeId: null,
    }),
}))
