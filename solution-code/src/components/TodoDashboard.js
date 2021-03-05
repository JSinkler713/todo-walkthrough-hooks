import React, {Component} from 'react'

const TodoDashboard = (props) => {
    return (
      <div className="count-wrapper">
        <p>You have <span className="count">{props.todoCount} todos</span> left to complete.</p>
      </div>
    )
}

export default TodoDashboard


