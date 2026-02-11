export type Priority = 'high' | 'medium' | 'low'

export type ColumnId = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  assignee: string
  dueDate: string
  columnId: ColumnId
  createdAt: string
  order: number
}

export interface Column {
  id: ColumnId
  title: string
  color: string
}

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', color: 'var(--color-column-backlog)' },
  { id: 'todo', title: 'To Do', color: 'var(--color-column-todo)' },
  { id: 'in-progress', title: 'In Progress', color: 'var(--color-column-inprogress)' },
  { id: 'review', title: 'Review', color: 'var(--color-column-review)' },
  { id: 'done', title: 'Done', color: 'var(--color-column-done)' },
]
