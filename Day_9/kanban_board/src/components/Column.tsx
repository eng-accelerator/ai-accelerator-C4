import { useState } from 'react'
import type { Column as ColumnType, Task } from '../types'
import { TaskCard } from './TaskCard'

interface ColumnProps {
  column: ColumnType
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: () => void
  onDropTask: (taskId: string, columnId: string) => void
  draggedTaskId: string | null
}

export function Column({ column, tasks, onTaskClick, onAddTask, onDropTask, draggedTaskId }: ColumnProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onDropTask(taskId, column.id)
    }
  }

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] h-full">
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
            {column.title}
          </h2>
          <span className="text-[11px] text-text-muted font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex-1 flex flex-col gap-1.5 p-1 rounded-[var(--radius-lg)]
          transition-colors duration-150
          overflow-y-auto
          ${isOver ? 'bg-accent-subtle' : ''}
        `}
      >
        {tasks.map(task => (
          <div
            key={task.id}
            className={`transition-opacity duration-150 ${draggedTaskId === task.id ? 'opacity-40' : 'opacity-100'}`}
          >
            <TaskCard
              task={task}
              onClick={() => onTaskClick(task)}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', task.id)
                e.dataTransfer.effectAllowed = 'move'
              }}
            />
          </div>
        ))}

        {tasks.length === 0 && (
          <div className={`
            flex items-center justify-center h-20
            rounded-[var(--radius-md)] border border-dashed
            transition-colors duration-150
            ${isOver ? 'border-accent text-accent' : 'border-border-secondary text-text-muted'}
          `}>
            <span className="text-[11px]">
              {isOver ? 'Drop here' : 'No tasks'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
