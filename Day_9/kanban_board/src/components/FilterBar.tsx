import type { Priority } from '../types'

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  assigneeFilter: string
  onAssigneeFilterChange: (value: string) => void
  priorityFilter: Priority | ''
  onPriorityFilterChange: (value: Priority | '') => void
  assignees: string[]
  onNewTask: () => void
}

export function FilterBar({
  search,
  onSearchChange,
  assigneeFilter,
  onAssigneeFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  assignees,
  onNewTask,
}: FilterBarProps) {
  const hasFilters = search || assigneeFilter || priorityFilter

  const inputClasses = 'bg-bg-tertiary border border-border-secondary rounded-[var(--radius-sm)] px-3 py-1.5 text-[12px] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors'

  return (
    <div className="flex items-center gap-3 px-6 py-3 border-b border-border-secondary bg-bg-secondary">
      <div className="relative flex-1 max-w-xs">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className={`${inputClasses} pl-8 w-full`}
        />
      </div>

      <select
        value={assigneeFilter}
        onChange={e => onAssigneeFilterChange(e.target.value)}
        className={inputClasses}
      >
        <option value="">All assignees</option>
        {assignees.map(a => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <select
        value={priorityFilter}
        onChange={e => onPriorityFilterChange(e.target.value as Priority | '')}
        className={inputClasses}
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {hasFilters && (
        <button
          onClick={() => {
            onSearchChange('')
            onAssigneeFilterChange('')
            onPriorityFilterChange('')
          }}
          className="text-[11px] text-text-muted hover:text-text-secondary transition-colors"
        >
          Clear
        </button>
      )}

      <div className="flex-1" />

      <button
        onClick={onNewTask}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-accent hover:bg-accent-hover rounded-[var(--radius-sm)] transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        New Task
      </button>
    </div>
  )
}
