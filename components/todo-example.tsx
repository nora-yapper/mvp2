"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

interface Todo {
  id: string
  name: string
  complete: boolean
}

export default function TodoExample() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("")

  const addTodo = (name: string) => {
    if (name.trim()) {
      setTodos((prevTodos) => {
        return [...prevTodos, { id: uuidv4(), name: name, complete: false }]
      })
      setInputValue("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, complete: !todo.complete } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Todo List with UUID</h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo(inputValue)}
          placeholder="Enter a new todo..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={() => addTodo(inputValue)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Add Todo
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "15px",
              backgroundColor: todo.complete ? "#f8f9fa" : "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              textDecoration: todo.complete ? "line-through" : "none",
              opacity: todo.complete ? 0.7 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={todo.complete}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: "10px" }}
            />
            <span style={{ flex: 1, fontSize: "16px" }}>{todo.name}</span>
            <small style={{ color: "#666", fontSize: "12px" }}>ID: {todo.id.slice(0, 8)}...</small>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>No todos yet. Add one above!</p>
      )}
    </div>
  )
}
