import { useState, useMemo } from 'react'
import { COLUMNS } from '../types'
import type { Task, ColumnId, Priority } from '../types'
import { useBoard } from '../hooks/useBoard'
import { Column } from './Column'
import { TaskModal } from './TaskModal'
import { FilterBar } from './FilterBar'

export function Board() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, allAssignees } = useBoard()

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [creatingInColumn, setCreatingInColumn] = useState<ColumnId | null>(null)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('')

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
      if (assigneeFilter && task.assignee !== assigneeFilter) return false
      if (priorityFilter && task.priority !== priorityFilter) return false
      return true
    })
  }, [tasks, search, assigneeFilter, priorityFilter])

  const getFilteredColumnTasks = (columnId: ColumnId) => {
    return filteredTasks
      .filter(t => t.columnId === columnId)
      .sort((a, b) => a.order - b.order)
  }

  const handleDropTask = (taskId: string, columnId: string) => {
    setDraggedTaskId(null)
    moveTask(taskId, columnId as ColumnId)
  }

  const handleSaveNew = (data: { title: string; description: string; priority: Priority; assignee: string; dueDate: string; columnId: ColumnId }) => {
    addTask(data)
    setCreatingInColumn(null)
  }

  const handleSaveEdit = (data: { title: string; description: string; priority: Priority; assignee: string; dueDate: string; columnId: ColumnId }) => {
    if (!editingTask) return
    updateTask(editingTask.id, data)
    setEditingTask(null)
  }

  const handleDelete = () => {
    if (!editingTask) return
    deleteTask(editingTask.id)
    setEditingTask(null)
  }

  return (
    <div
      className="flex flex-col h-full"
      onDragEnd={() => setDraggedTaskId(null)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-secondary">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-accent">
            <rect x="2" y="2" width="5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="9" y="2" width="5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="16" y="2" width="0" height="13" rx="0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h1 className="text-[15px] font-semibold text-text-primary tracking-tight">
            Kanban Board
          </h1>
        </div>
        <span className="text-[11px] text-text-muted">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        assignees={allAssignees}
        onNewTask={() => setCreatingInColumn('backlog')}
      />

      {/* Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-4 h-full">
          {COLUMNS.map(column => (
            <Column
              key={column.id}
              column={column}
              tasks={getFilteredColumnTasks(column.id)}
              onTaskClick={task => setEditingTask(task)}
              onAddTask={() => setCreatingInColumn(column.id)}
              onDropTask={handleDropTask}
              draggedTaskId={draggedTaskId}
            />
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {creatingInColumn && (
        <TaskModal
          defaultColumnId={creatingInColumn}
          onSave={handleSaveNew}
          onClose={() => setCreatingInColumn(null)}
        />
      )}

      {/* Edit Modal */}
      {editingTask && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}
