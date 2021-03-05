import React, { useState, useEffect } from 'react'
import TodoModel from '../models/Todo'
import Todos from '../components/Todos'
import TodoDashboard from '../components/TodoDashboard'
import CreateTodoForm from '../components/CreateTodoForm'


function TodosContainer() {
  const [todos, setTodos] = useState([])
  const [todoCount, setTodoCount] = useState(0)
  
  useEffect(()=> {
    fetchData()
  }, [])

  const fetchData = async() => {
    const res = await TodoModel.all()
    setTodos(res.data)
    setTodoCount( res.data.filter(todo=> todo.completed === false).length)
  }

  const createTodo = async(todo) => {
    let newTodo = {
        body: todo,
        completed: false
    }
    console.log('in create function')
    const anotherTodo = await TodoModel.create(newTodo)
    let newTodos = [...todos, anotherTodo.data]
    setTodos(newTodos)
    setTodoCount( todoCount + 1)
  }

  const updateTodo = async (todoBody, todoId) => {
    function isUpdatedTodo(todo) {
        return todo._id === todoId;
    }
    const result = await TodoModel.update(todoId, todoBody)
    let todosCurrent = [...todos]
    todosCurrent.find(isUpdatedTodo).body = todoBody.body
    setTodos(todosCurrent)
  }


  const deleteTodo = async (todo) => {
    if (!todo.completed) {
      setTodoCount( todoCount - 1)
    }
    let res = await TodoModel.delete(todo)
    let tempTodos = todos.filter(function(todo) {
      return todo._id !== res.data._id
    });
    setTodos(tempTodos)
  }

  const markComplete = async(todoId, complete) => {
    console.log(complete)
    function isUpdatedTodo(todo) {
      return todo._id === todoId;
    } 
    let currentTodos = [...todos];
    currentTodos.find(isUpdatedTodo).complete = complete
    setTodos( currentTodos )
    const res = await TodoModel.update( todoId, complete )
    if (complete.completed) {
      setTodoCount( todoCount - 1)
    }
    else {
      setTodoCount( todoCount + 1 )
    }
    return res.data.completed
  }

  const clearCompleted = () => {
    console.log("CLEAR!")
    // let filteredTodos = this.state.todos
    const filteredTodos = [...todos]
      .filter( todo => {
        console.log("in filter")
        if(todo.completed === true ){
          console.log("bye!")
          TodoModel.delete(todo)
        }
          return true
      })
      setTodos(filteredTodos)
  }
  
  return (
    <div className='todosComponent'>
      <CreateTodoForm
        createTodo={ createTodo }
        />
      <Todos
        todos={todos.length ? todos : []}
        onDeleteTodo={deleteTodo} 
        onUpdateTodo={updateTodo} 
        markComplete={markComplete}
        />
      <TodoDashboard 
        todoCount={todoCount} />
    </div>
  )
}

export default TodosContainer

