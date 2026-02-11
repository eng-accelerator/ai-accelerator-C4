import { useState, useEffect, useCallback } from 'react'
import type { Task, ColumnId } from '../types'
import { loadTasks, saveTasks } from '../store'
import { v4 as uuidv4 } from 'uuid'

export function useBoard() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    setTasks(prev => {
      const columnTasks = prev.filter(t => t.columnId === task.columnId)
      const maxOrder = columnTasks.reduce((max, t) => Math.max(max, t.order), -1)
      return [...prev, {
        ...task,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        order: maxOrder + 1,
      }]
    })
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const moveTask = useCallback((taskId: string, toColumnId: ColumnId, newOrder?: number) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId)
      if (!task) return prev

      const targetColumnTasks = prev
        .filter(t => t.columnId === toColumnId && t.id !== taskId)
        .sort((a, b) => a.order - b.order)

      const order = newOrder ?? targetColumnTasks.length

      const reordered = targetColumnTasks.map((t, i) => ({
        ...t,
        order: i >= order ? i + 1 : i,
      }))

      return prev.map(t => {
        if (t.id === taskId) return { ...t, columnId: toColumnId, order }
        const updated = reordered.find(r => r.id === t.id)
        return updated ?? t
      })
    })
  }, [])

  const getColumnTasks = useCallback((columnId: ColumnId) => {
    return tasks
      .filter(t => t.columnId === columnId)
      .sort((a, b) => a.order - b.order)
  }, [tasks])

  const allAssignees = [...new Set(tasks.map(t => t.assignee).filter(Boolean))]

  return { tasks, addTask, updateTask, deleteTask, moveTask, getColumnTasks, allAssignees }
}
