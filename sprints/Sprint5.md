## Sprint 5: Deleting Todos

Deleting will work similarly with regard to passing state. Let's update the `Todo` component to contain a UI with which to delete a todo. In `src/components/Todo.js`:

```js
const Todo = (props) => {

  const deleteClickedTodo = () => props.deleteTodo(props.todo)

  return (
    <li data-todos-index={props.todo._id}>
      <span className="todo-item">{props.todo.body}</span>
      <span
        className='remove'
        onClick={deleteClickedTodo}>
        Remove
      </span>
    </li> 
  );
};
```

We've added a span tag with `remove` text inside. When it gets clicked it invokes the `deleteTodo` function defined on `props`. That means we need to pass `.deleteTodo` as `props` from the parent component of `Todos`. In `src/components/Todos.js`

```js
let todos = props.todos.map((todo) => {
  return (
    <Todo
      key={todo._id}
      todo={todo}
      deleteTodo={props.deleteTodo}/>
  );
});
```

Looks like it's not defined here either but passed yet again from a parent container. Finally in the `src/containers/TodosContainer.js`:

```js

// After the todo delete response is sent back from the server, we find the corresponding entry for the todo in our todos state array and remove it.
  const deleteTodo = async (todo) => {
    let res = await TodoModel.delete(todo)
    let tempTodos = todos.filter(function(todo) {
      return todo._id !== res.data._id
    });
    setTodos(tempTodos)
  }


  return (
    <div className="todosComponent">
      <CreateTodoForm
        createTodo={createTodo}
        />
      <Todos
        todos={todos}
        deleteTodo={deleteTodo}
        />
    </div>
  );
};
```

Before we talk about the above code, lets look at what delete looks like in our `TodoModel`. In `src/models/Todo.js`:

```js
  static delete = (todo) => {
    let request = axios.delete(`${endPoint}/${todo._id}`);
    return request;
  };
```

The `deleteTodo` takes the todo, passed from the child Component of `Todo` up through a chain of references. It deletes it with axios. Upon deletion, all todos are grabbed from the container state and filters out the one deleted, updates the state to have only the remaining todos.


And now the final frontier! [Sprint 6: Editing and Updating Todos!](Sprint6.md)
