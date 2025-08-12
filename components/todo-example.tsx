"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function TodoExample() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: uuidv4(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setTodos([...todos, todo])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Todo List with UUID</CardTitle>
        <CardDescription>Demonstrating UUID usage for unique identifiers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
          />
          <Button onClick={addTodo} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="outline">
            {completedCount}/{todos.length} completed
          </Badge>
          <Badge variant="secondary">{todos.length} total</Badge>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center space-x-2 p-2 border rounded-lg">
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
              <span className={`flex-1 text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.text}
              </span>
              <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">No todos yet. Add one above!</div>
        )}

        <div className="text-xs text-muted-foreground">
          Each todo has a unique UUID: {todos.length > 0 && todos[0].id.slice(0, 8)}...
        </div>
      </CardContent>
    </Card>
  )
}
