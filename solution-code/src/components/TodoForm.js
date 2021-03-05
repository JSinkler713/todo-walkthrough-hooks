import React, { useState, useEffect } from 'react'

function TodoForm(props) {
  const [todo, setTodo] = useState()

  function onChange(event) {
    setTodo(event.target.value)
  }

  function onSubmit(event){
    event.preventDefault()
    props.toggleBodyForm()
    console.log({body: todo})
    props.onUpdateTodo({body: todo}, props.todo._id)
  }

  useEffect(()=> {
    setTodo(props.todo.body)
  }, [])
  return (
    <div style={props.style} className='todoForm'>
      <form className="editor" onSubmit={ onSubmit }>
        <input
          autoFocus={props.autoFocus}
          onChange={ onChange } 
          type='text'
          value={(todo) || ''} />
        <button type='submit' className="btn">{props.buttonName}</button>
      </form>
    </div>
  )
}
export default TodoForm
