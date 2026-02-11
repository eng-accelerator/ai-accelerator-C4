import type { Task } from '../types'

const priorityConfig = {
  high: { label: 'High', dotClass: 'bg-priority-high', bgClass: 'bg-priority-high-bg', textClass: 'text-priority-high' },
  medium: { label: 'Med', dotClass: 'bg-priority-medium', bgClass: 'bg-priority-medium-bg', textClass: 'text-priority-medium' },
  low: { label: 'Low', dotClass: 'bg-priority-low', bgClass: 'bg-priority-low-bg', textClass: 'text-priority-low' },
}

interface TaskCardProps {
  task: Task
  onClick: () => void
  isDragOverlay?: boolean
  onDragStart?: (e: React.DragEvent) => void
}

export function TaskCard({ task, onClick, isDragOverlay, onDragStart }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.columnId !== 'done'

  return (
    <div
      draggable={!isDragOverlay}
      onDragStart={onDragStart}
      onClick={onClick}
      className={`
        group rounded-[var(--radius-md)] border border-border-secondary bg-bg-card
        p-3 cursor-grab active:cursor-grabbing select-none
        transition-all duration-150 ease-out
        hover:bg-bg-card-hover hover:border-border-primary
        ${isDragOverlay ? 'shadow-2xl shadow-black/40 border-border-accent rotate-[2deg] scale-105 opacity-90' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-[13px] font-medium text-text-primary leading-snug line-clamp-2">
          {task.title}
        </h3>
      </div>

      {task.description && (
        <p className="text-[11px] text-text-tertiary leading-relaxed line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${priority.bgClass} ${priority.textClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dotClass}`} />
          {priority.label}
        </span>

        {task.assignee && (
          <span className="text-[10px] text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">
            {task.assignee}
          </span>
        )}

        {task.dueDate && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${isOverdue ? 'text-priority-high bg-priority-high-bg' : 'text-text-muted bg-bg-tertiary'}`}>
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}
