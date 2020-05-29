## Sprint 4: Creating Todos
We're going to create a component that handles the form that will allow a user to create todos. Before we build this feature, you should know that this sprint is going to explore some concepts in React that are new to us; namely, using state to hold onto form data until the user is ready to submit that data. 

When the user does finally submit the form, where does that data go? Read on to find out more and you may want to run through this sprint two or three more times to make sure this makes sense.

Lets write this feature to shed some more light on it.

Let's create a file `src/components/CreateTodoForm.js` and fill it out with the following:

```js
import React, { Component } from 'react';

class CreateTodoForm extends Component {
  state = {
    todo: '',
  };
  
  onInputChange = (event) => {
    this.setState({
      todo: event.target.value,
    });
  };
  
  onFormSubmit = (event) => {
    event.preventDefault();
    let todo = this.state.todo;
    this.props.createTodo(todo);
    this.setState({
      todo: '',
    });
  };
  
  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit} id="taskForm">
          <input  
            onChange={this.onInputChange} 
            type="text" id="newItemDescription" 
            placeholder="What do you need to do?" 
            value={this.state.todo}
          />
          <button type="submit" id="addTask" className="btn">Add Todo</button>
        </form>
      </div>
    );
  };
};

export default CreateTodoForm;
```

Whoa.. pauuuuseee. Let's take a look. First let's look at what we're rendering:

```js
render() {
  return (
    <div>
      <form onSubmit={this.onFormSubmit} id="taskForm">
        <input  
          onChange={this.onInputChange} 
          type="text" id="newItemDescription" 
          placeholder="What do you need to do?" 
          value={this.state.todo}
        />
        <button type="submit" id="addTask" className="btn">Add Todo</button>
      </form>
    </div>
  );
};
```

We define the initial state of the form in the constructor.

Looks like a form. When it gets submitted we run a function (we're using es6 arrow function here to pass an anonymous function with an event argument). That function is the `.onFormSubmit` function defined in this component.

> `onSubmit` is reserved JSX to define an event for form submission, almost identical to `ng-submit` in angular

Similarly when the `input` is changed we run `.onInputChange`.


Let's take a look at the `onInputChange` function first:

```js
onInputChange = (event) => {
  this.setState({
    todo: event.target.value,
  });
};
```

Basically whenever this input changes, we're going to set the state of this component to have a property of `todo` and it's value is whatever the input field's value is.

`onFormSubmit`:

```js
onFormSubmit = (event) => {
  event.preventDefault();
  let todo = this.state.todo;
  this.props.createTodo(todo);
  this.setState({
    todo: '',
  });
};
```

First off, prevent the default action as form submission will cause a request to fire. Then instantiate a variable todo from the state. Lastly we also set the todo property of the state as an empty string. We skipped one line though, `this.props.createTodo(todo)` What does that tell us about where `createTodo` comes from?

It needs to be supplied from its parent component. Let's update the `src/containers/TodosContainer.js` so that we can successfully create todos:

In `src/containers/TodosContainer.js`:  

```js
// At the top import the component
import CreateTodoForm from '../components/CreateTodoForm';

...

createTodo = (todo) => {
    let newTodo = {
        body: todo,
        completed: false,
    };
    
    TodoModel.create(newTodo).then((res) => {
        let todos = this.state.todos;
        todos.push(res.data);
        this.setState({ todos: todos });
    });
};

render() {
  return (
    <div className="todosComponent">
      <CreateTodoForm
        createTodo={this.createTodo} />

      <Todos
        todos={this.state.todos} />
    </div>
  );
};
```

We see that we pass the `createTodo` function of THIS container component TO the `CreateTodoForm` component. Since we are using arrow functions instead of traditional function definitions we are not bound to a `this` inside our methods.  The `this` inside the methods actually refers to the context of the component. 

In the actual `createTodo` function. We can see that we construct everything we need about a todo in an object and store it in a variable. We then pass that object to a `.create` method on our `TodoModel` that ... hasn't been defined yet. Let's define it now. In `src/models/Todo.js`:

```js
static create = (todo) => {
  let request = axios.post(endPoint, todo);
  return request;
};
```

Using axios, we create the `todo`. In the promise, we fetch all the `todos` and set the state to encapsulates those `todos` from the response.

## Backtrack - How did we pass state from child to parent?

Remember that in the submit event of the form, we used a function `this.props.createTodo()`:

In `src/components/CreateTodoForm`:

```js
onFormSubmit = (event) => {
  event.preventDefault();
  let todo = this.state.todo;
  this.props.createTodo(todo);
  this.setState({
    todo: '',
  });
};
```

We pass `createTodo` from the container as `props`. In `src/containers/TodosContainer.js`:

```js
constructor() {
  super(); 
};

render() {
  return (
    <div className="todosContainer">
      <CreateTodoForm
        createTodo={ this.createTodo } />

      <Todos
        todos={this.state.todos} />
    </div>
  );
};
```

The argument passed in at the `CreateTodoForm` level(child) was state from that component. And now it updates state at the `TodosContainer` level(parent).

Sweet! Lets go to [Sprint 5: Deleting Todos](Sprint5.md)
