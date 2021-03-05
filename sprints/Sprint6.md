## Sprint 6: Editing and Updating Todos

### Implementing Edit

To update a `todo` in our database we will need to initiate a pre-filled form that contains that specific data.  Once the user has updated the text in the form, they can click a button to initiate a save. The actual save button will trigger the database call to update.  

In `containers/TodosContainer.js`:

```js
  /* createTodo = ...  */

  /* deleteTodo = ...  */

  const updateTodo = async(todo) => {
    //little find helper
    const isUpdatedTodo = t => {
        // return the first todo with the right id
        return t._id === todo._id;
    };

    let result = await TodoModel.update(todo)
    let todosNow = [...todos]
    todosNow.find(isUpdatedTodo).body = todo.body;
    setTodos( todosNow )
  };

    return (
      <div className="todosComponent">
        <CreateTodoForm
          createTodo={ createTodo }
        />
        <Todos
          todos={ todos }
          updateTodo={ updateTodo } 
          deleteTodo={ deleteTodo }
          />
      </div>
    );
  };
```

In the `components/Todos.js`, add `updateTodo` to `<Todo>` props:

```js
//....
 let todos = props.todos.map((todo) => {
      return (
        <Todo
          key={todo._id}
          todo={todo}
          deleteTodo={props.deleteTodo}
          updateTodo={props.updateTodo} 
          />
      );
    });
//...
```

<!-- Todo changes -->
In `components/Todo.js` We need to add some state and add the method  `toggleBodyForm`:

```js
  const [complete, setComplete] = useState(Boolean())
  const [formStyle, setFormStyle ] = useState({ display: 'none'})
  const [bodyStyle, setBodyStyle ] = useState({})

  const toggleBodyForm = () => {
    if (formStyle.display === 'block') {
      setFormStyle({ display: 'none'})
      setBodyStyle({ display: 'block'})
    } else {
      setFormStyle({display: 'block'})
      setBodyStyle({display: 'none'})
    }
  }
```

This will hide the `todo` body and reveal the `todoForm` components.

Lets update our `Todo` render to have the `TodoForm` included. We'll also add an Edit link. When the user clicks on the edit link, the form will appear prepopulated with the text of the todo for easy altering. Neat!

```js
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
```

You will then have to both write the `TodoForm` component and then import it into `components/Todo.js`:

```js
//TodoForm.js
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

```

```js
//Todo.js
import React, { useState, useEffect } from 'react'
import TodoForm from './TodoForm'

//...
```

In `models/Todo.js` add our method:

```js
  static update = (todo) => {
    let request = axios.put(`${endPoint}/${todo._id}`, todo);
    return request;
  };
```

Think back to what we did for the other CRUD actions--we define some axios behavior in `/models/Todo.js`. Then we define a method in `TodosContainer` that will handle update behavior.

Then we make our way down from `TodosContainer` to `Todos` to `Todo`, with `state` trickling down as `props`.

## Conclusion

We've learned how to do full CRUD for a basic todo app here. We've seen in particular how props can be trickled down through parent and child components to make a very modular app. We've also been introduced to the magic of axios for network calls from our frontend.

Some Extensions to try.
Create a `<TodoDashboard todoCount={todoCount} />` That tracks how many todos you have left that are still uncompleted.

What about building out the API from scratch?
It's a lot, but everything beyond this is mostly making it look good. Happy Coding
