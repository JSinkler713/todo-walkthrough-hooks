import React, { useState, useEffect } from 'react'
import TodoForm from './TodoForm'


const Todo = (props) => {
  const [complete, setComplete] = useState(Boolean())
  const [formStyle, setFormStyle ] = useState({ display: 'none'})
  const [bodyStyle, setBodyStyle ] = useState({})

  // watch for props.complete to change, if so update
  useEffect(()=> {
    setComplete(props.todo.complete)
  }, [props.complete])

  const toggleBodyForm = () => {
    if (formStyle.display === 'block') {
      setFormStyle({ display: 'none'})
      setBodyStyle({ display: 'block'})
    } else {
      setFormStyle({display: 'block'})
      setBodyStyle({display: 'none'})
    }
  }

  const deleteClickedTodo = () => props.onDeleteTodo(props.todo)

  const handleCheck = () => {
    setComplete(!complete)
    props.markComplete(props.todo._id, {completed: !complete})
  }

  return(
    <li 
      data-todos-index={props.todo.id}
      >
      <div style={bodyStyle}>
        <input 
          type="checkbox" 
          checked={Boolean(complete)} 
          onChange={handleCheck} />
        <span 
          className= { complete ? "completed item" : "item" }>
          {props.todo.body}</span>
        <a
          className='edit' 
          onClick={toggleBodyForm}>
          edit
        </a>
        <a
          className='remove'
          onClick={deleteClickedTodo}>
          Remove
        </a>
      </div>
      <TodoForm
        todo={props.todo}
        style={formStyle}
        autoFocus={true}
        buttonName="Save"
        onUpdateTodo={props.onUpdateTodo} 
        toggleBodyForm={toggleBodyForm}/>
    </li> 
  )
}

export default Todo