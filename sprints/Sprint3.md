# Sprint 3: Fetching Data with Axios

React actually isn't as full featured as say AngularJS or BackboneJS. It relies on third party libraries to fetch data. Today, we'll be using a library called [Axios](https://github.com/mzabriskie/axios), a promise based HTTP client for the browser and node. You could also use fetch although your code will be a little different then the following. Let's install the module now and also create the folder & file that will contain our database logic:

```bash
$ npm i axios 
$ mkdir src/models
$ touch src/models/Todo.js
```

Now in `src/models/Todo.js`, we are going to use our crud API endpoint of todos to get some data (you can check out the raw json at https://sei-111-todo-backend.herokuapp.com/todos):

```js
import axios from 'axios';

// we could also put this in an environment variable if we wanted to
const endPoint = `https://sei-111-todo-backend.herokuapp.com/todos`;

class TodoModel {
  static all = () => {
    let request = axios.get(endPoint);
    return request;
  };
};

export default TodoModel;
```

When we use the `all` method on our `TodoModel`, it will make a get request to our API for *all* todos. We return the request which will be a pending Promise. This isn't a react component, it's just a class where we are defining different methods to use as different requests to our backend.

Note also that `all()` is a static method. What does this mean? A **static** method can be called without there being an **instance** of the class containing the **static** method. This will allow us to call `all()` in the following way (without ***instantiating*** the class with new):

```js
let todos = TodoModel.all();
```


**Class methods** don't require an instance of the class in order to be called, but an **instance method** does. [More on Static Methods in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Static_methods)

We can't really test out the code in this file in isolation, so we must `import` it into our application in order to test it. The logical place to import this code is in the `TodosContainer` component.

For now, let's toss this in the `TodosContainer`'s `render()` method: this isn't ultimately going to be where we want to call `TodoModel.all()`, but for testing purposes, it will suffice.

In `containers/TodosContainer.js`:

```js
import React, { useState, useEffect } from 'react'
import TodoModel from '../models/Todo

function TodosContainer() {
  useEffect(()=> {
    const fetchData = async()=> {
      const res = await TodoModel.all()
      console.log(res)
    }
    fetchData()
  })
  return (
    <div className='todosContainer'>
      <h2>This is a todos container</h2>
    </div>
  );
};

export default TodosContainer;
```

Awesome, we can see the response from our database as soon as the page loads and our `useEffect` runs, we know it's working! Notice that the actual `json` we want is stored in the `data` attribute of the response.  This is a standard format for `axios` returns.  

We can now see that everything is working! However, its completely in the wrong spot and we don't have anything we're passing todos to... yet!

Now that we can get our data, let's code how we present that data. It'll be a bit before we connect these pieces and actually see our todos in our app, but just hold on, we'll get there!

### Rendering A Todo
Let's start at the bottom and bubble up. It would be nice if each `todo` element had its own component to follow FIRST(Focused Independent Reusable Small Testable) principles. Let's create `src/components/Todo.js` and put the following in it:

```js
import React, { useState, useEffect } from 'react'

const Todo = (props) => 
  return (
    <li data-todos-index={props.todo._id}>
      <span className="todo-item">{props.todo.body}</span>
    </li> 
  );
};

export default Todo;
```

When we write this component we know that if we pass it a `todo`, as a `prop`, that has both an id and a body, that it will render. AND it will render the same way every time. So what will be rendering each individual `Todo` component?

### Rendering Todos
We need another component. Its responsibility will be to render all of the todos. Let's create another component `src/components/Todos.js` and fill it with the following:

```js
import React from 'react';
import Todo from './Todo';

const Todos = (props) => {
  // our friend map
  let todos = props.todos.map((todo) => {
    return (
      <Todo
        key={todo._id}
        todo={todo} />
    );
  });

  return (
    <ul>
      {todos}
    </ul>
  );
};

export default Todos;
```

In this component, we have a property called todos. What type of data will this variable be? When we eventually use this component, we need to pass it that property. Once we have our todos, it takes each one and maps a `Todo` component to the variable `todos`. Then renders all of the todos. We can use the map function to render multiple components for each individual todo and store them in a variable.

### Putting it all together, at last! Todos

Let's shove the remaining code we need in and then let's talk about it. In `src/containers/TodosContainer.js`:

```js
import { useState, useEffect } from 'react'
import TodoModel from '../models/Todo'
import Todos from '../components/Todos'

function TodosContainer() {
  const [todos, setTodos] = useState([])
  const [todoCount, setTodoCount] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await TodoModel.all()
    setTodos(res.data)
    setTodoCount(res.data.filter((todo) => todo.completed === false).length)
  }
  return (
    <div className='todosComponent'>
      <Todos todos={todos} />
    </div>
  )
}

export default TodosContainer
```

If we take a look at our browser now... BAM todos! What just happened....


```js
const fetchData = async() => {
  // remember this was a promise
  const res = await TodoModel.all()
  setTodos(res.data)
  setTodoCount( res.data.filter(todo=> todo.completed === false).length)
}
```

This function leverages our model to retrieve our `todos` from our backend. In the promise of that request we set the state of this container component to have `todos` be the value returned from the response. Any time `setTodos` is invoked the component re-renders.

```js
useEffect(()=> {
  fetchData()
}, [])
```

### Hooks
Every component in react undergoes a component lifecycle. There are several "hooks" throughout this lifecycle. You can think of hooks like events that we can trigger functionality on. `useEffect` is a reserved hook that happens after a component renders. There are ways to use this hook. With the empty array it acts like a `componentDidMount` effect. Check the react docs for the other ways to use `useEffect`.


You might be asking yourself: "Wait, why are we getting the data after the components already been rendered?" ([Andy did too](http://stackoverflow.com/questions/39338464/reactjs-why-is-the-convention-to-fetch-data-on-componentdidmount))

That's because a re-render will always happen because fetching data happens asynchronously. Here's the old [Facebook recommendation](https://reactjs.org/docs/react-component.html#componentwillmount) and the new [FACEBOOK rec](https://reactjs.org/docs/faq-ajax.html)

### Passing State from parents to children
How have we passed state? What do we mean by state with reference to a react component? The state of the `TodosContainer` is simple, the todos. How does each individual todo know about the todo they need to render? From the state of the most parent container, `TodosContainer`.

If we take a look at the `props` being passed from one component to the next, we can clearly see the chain of how information was passed.

In `src/containers/TodosContainer.js`:


```javascript  
<Todos
  todos={todos} />
```

In `src/components/Todos.js`:  

```js
let todos = props.todos.map((todo) => {
  return (
    <Todo
      key={todo._id}
      todo={todo}
    />
  );
});
```

In `src/components/Todo.js`:

```js
  <li data-todos-index={props.todo._id}>
    <span className="todo-item">{props.todo.body}</span>
  </li> 
```

### PAUSE - Why is this awesome?
We could stop the lesson here and take this knowledge and build lots of cool things with it. Most of the API's developers have access to are read-only. That said, if we know an endpoint to get data, we now know how to use React to display that data.

Upwards and onwards to [Sprint 4: Creating Todos](Sprint4.md)
