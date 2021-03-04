import React, {Component} from 'react'
import TodoModel from '../models/Todo'
import Todos from '../components/Todos'
import TodoDashboard from '../components/TodoDashboard'
import CreateTodoForm from '../components/CreateTodoForm'

class TodosContainer extends Component {
  constructor(){
    super()
    this.state = {
      todos: [],
      editingTodoId: null,
      editing: false,
      todoCount: 0
    }
  }
  
  componentDidMount(){
    this.fetchData()
  }

  fetchData = async() => {
    
    const res = await TodoModel.all()
    this.setState({ 
      todos: res.data.todos,
      todo: '',
      todoCount: res.data.todos.filter(todo=> todo.completed === false).length
    })
    /*
    TodoModel.all().then( (res) => {
      this.setState ({
        todos: res.data.todos,
        todo: '',
        todoCount:res.data.todos.filter(todo => todo.completed === false).length
      })
    })
    */
  }

  createTodo = async(todo) => {
    let newTodo = {
        body: todo,
        completed: false
    }
    console.log('in create function')
    const anotherTodo = await TodoModel.create(newTodo)
    let todos = this.state.todos
    let newTodos = [...todos, anotherTodo.data]
    this.setState({ todos: newTodos })
    /*
    TodoModel.create(newTodo).then((res) => {
        let todos = this.state.todos
        let newTodos = todos.push(res.data)
        this.setState({newTodos})

    })
    */
  }

  updateTodo = async (todoBody, todoId) => {
    function isUpdatedTodo(todo) {
        return todo._id === todoId;
    }
    const result = await TodoModel.update(todoId, todoBody)
    let todos = this.state.todos
    todos.find(isUpdatedTodo).body = todoBody.body
    this.setState({ todos: todos })
    /*
    TodoModel.update(todoId, todoBody).then((res) => {
        let todos = this.state.todos
        todos.find(isUpdatedTodo).body = todoBody.body
        this.setState({todos: todos})
    })
    */
  }


  deleteTodo = async (todo) => {
    let res = await TodoModel.delete(todo)
    let todos = this.state.todos.filter(function(todo) {
      return todo._id !== res.data._id
    });
    this.setState({todos})
    /*
    TodoModel.delete(todo).then((res) => {
        let todos = this.state.todos.filter(function(todo) {
          return todo._id !== res.data._id
        });
        this.setState({todos})
    })
    */
  }

  markComplete = async(todoId, complete) => {
    console.log(complete)
    function isUpdatedTodo(todo) {
      return todo._id === todoId;
    } 
    let todos = this.state.todos;
    todos.find(isUpdatedTodo).complete = complete
    this.setState({
      todos: todos
    })
    const res = await TodoModel.update( todoId, complete )
    if (complete.completed) {
      this.setState({
        todoCount: this.state.todoCount - 1
      })
    }
    else {
      this.setState({
        todoCount: this.state.todoCount + 1
      })
    }
    return res.data.completed

    /*
    TodoModel.update( todoId, complete ).then((res) => {
      if(complete.completed){
        this.setState({
          todoCount: this.state.todoCount - 1
        })
      } else {
        this.setState({
          todoCount: this.state.todoCount + 1
        })
      }
      return res.data.completed
    })
    */
  }

  clearCompleted = () => {
    console.log("CLEAR!")
    
    let filteredTodos = this.state.todos
      .filter( todo => {
        console.log("in filter")
        if(todo.completed === true ){
          console.log("bye!")
          TodoModel.delete(todo)
        }
          return true
        
      })
      this.setState({
        todos: filteredTodos
      })

  }
  
  render(){
    return (
      <div className='todosComponent'>
        <CreateTodoForm
          createTodo={ this.createTodo }
          />
        <Todos
          todos={this.state.todos}
          onDeleteTodo={this.deleteTodo} 
          onUpdateTodo={this.updateTodo} 
          markComplete={this.markComplete}
          />
        <TodoDashboard 
          todoCount={this.state.todoCount} />

      </div>
    )
  }
}

export default TodosContainer
