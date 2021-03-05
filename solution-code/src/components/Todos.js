import React, {Component} from 'react'
import Todo from './Todo'

const Todos = (props)=>  {
  console.log(props)
  let todos = props.todos.map( (todo) => {
    return (
      <Todo
        key={todo._id}
        todo={todo}
        onDeleteTodo={props.onDeleteTodo}
        onUpdateTodo={props.onUpdateTodo} 
        markComplete={props.markComplete}
        />
    )
  })

  return(
    <ul>
      {todos}
    </ul>
  )
}

export default Todos
