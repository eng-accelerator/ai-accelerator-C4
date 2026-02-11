import { useState, useEffect, useRef } from 'react'
import { COLUMNS } from '../types'
import type { Task, Priority, ColumnId } from '../types'

interface TaskModalProps {
  task?: Task | null
  defaultColumnId?: ColumnId
  onSave: (data: {
    title: string
    description: string
    priority: Priority
    assignee: string
    dueDate: string
    columnId: ColumnId
  }) => void
  onDelete?: () => void
  onClose: () => void
}

export function TaskModal({ task, defaultColumnId, onSave, onDelete, onClose }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [assignee, setAssignee] = useState(task?.assignee ?? '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [columnId, setColumnId] = useState<ColumnId>(task?.columnId ?? defaultColumnId ?? 'backlog')

  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description.trim(), priority, assignee: assignee.trim(), dueDate, columnId })
  }

  const inputClasses = 'w-full bg-bg-tertiary border border-border-primary rounded-[var(--radius-sm)] px-3 py-2 text-[13px] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors'
  const labelClasses = 'block text-[11px] font-medium text-text-secondary uppercase tracking-wider mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-bg-secondary border border-border-primary rounded-[var(--radius-lg)] shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-secondary">
          <h2 className="text-[14px] font-semibold text-text-primary">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelClasses}>Title</label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title..."
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className={inputClasses}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Status</label>
              <select
                value={columnId}
                onChange={e => setColumnId(e.target.value as ColumnId)}
                className={inputClasses}
              >
                {COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Assignee</label>
              <input
                type="text"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                placeholder="Name..."
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {task && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-1.5 text-[12px] font-medium text-priority-high hover:bg-priority-high-bg rounded-[var(--radius-sm)] transition-colors"
              >
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[12px] font-medium text-text-secondary hover:text-text-primary bg-bg-tertiary rounded-[var(--radius-sm)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-[12px] font-medium text-white bg-accent hover:bg-accent-hover rounded-[var(--radius-sm)] transition-colors"
              >
                {task ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
