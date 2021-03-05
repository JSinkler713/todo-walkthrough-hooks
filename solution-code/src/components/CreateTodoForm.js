import React, { useState } from 'react'

const CreateTodoForm  = (props) => {
  const [todo, setTodo] = useState('')
  
  const onInputChange = (event)=> {
    setTodo( event.target.value )
  }

  const onFormSubmit = (event)=> {
    event.preventDefault()
    props.createTodo(todo)
    setTodo('')
  }
  return (
    <div >
      <form onSubmit={ onFormSubmit } id="taskForm">
        <input  
          onChange={ onInputChange } 
          type="text" id="newItemDescription" 
          placeholder="What do you need to do?" 
          value={todo}
        />
        <button type="submit" id="addTask" className="btn">Add Todo</button>
      </form>
    </div>
  )
}

export default CreateTodoForm
