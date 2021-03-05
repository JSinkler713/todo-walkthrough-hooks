# Sprint 1: React Router

We're going to use React Router to handle our views. However, it isn't necessary for this application. We're really just going for exposure here. There's a lot to learn about react router and we'll just be scratching the surface. If you want to dive deeper, checkout [this tutorial](https://github.com/reactjs/react-router-tutorial)

We need a way to link to various urls to components in our application. Because our application will be a SPA (Single Page Application,) we still want to preserve different application-states via the url. This Todo app's application-states (not to be confused with component state) will just be the root url and a url to all todos(`/` and `/todos`)

### Creating Routes
Routes in React are just React components as well! Since we've installed the `react-router-dom` dependency, we'll start by wrapping our `App` Component in a `BrowserRouter` component available to us from `react-router-dom`. 

In `src/index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router>
    <App />
  </Router>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

Now, in `src/App.js`, let's add 2 routes for '/' and '/todos': 

```js
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import TodosContainer from './containers/TodosContainer';

function App() {
  return (
    <div className="container">
      <Switch>
        <Route exact path='/' component={ Home }/>
        <Route path='/todos' component={ TodosContainer }/>
      </Switch>
    </div>
  );
};

export default App;
```

We use the `Switch` component from `react-router-dom` to tell our app to switch between different routes, depending on the URL. Think of it as a container for our different Routes. If we have nested routes it can help make sure they run as we think they should. Then, we use the `Route` component, also given to us by `react-router-dom` to create a route for the root path(`'/'`). We also establish that the component that should be rendered here is a `Home` component. There is a second route for the path `/todos`, which should route to a `TodosContainer` component.

This will immediately ERROR our code out, because we don't actually have those files with those components defined. Take some time now to create a `Home` component with some dummy text inside (e.g. "I am the Home page"). Do the same for the `TodosContainer` component (e.g. "I am the TodosContainer page").

```bash
$ mkdir src/components
$ touch src/components/Home.js
$ mkdir src/containers
$ touch src/containers/TodosContainer.js
```
We will go over why `TodosContainer` is in a different `src/containers/` directory, vs the `src/components/` directory we've already created.

Now that you've created those files, make sure to add a simple React component inside each of them.

Inside the  `components/Home.js` React component add the following code:
  
```js
// components/Home.js
import React from 'react';

const Home = () => {
  return (
    <h2>
      I am the Home page
    </h2>
  );
};

export default Home;
```
  
In the `containers/TodosContainer` React component add the following code:
  
```js
// containers/TodosContainer.js
import React, { useState, useEffect } from 'react';

function TodosContainer() 
  return (
    <h2>
      I am the TodosContainer page
    </h2>
  );
};

export default TodosContainer;
```



Great, we should now be able to see our `Home` component's "I am the Home page" show up on `localhost:3000`! Going to `localhost:3000/todos` should show "I am the TodosContainer page".



### A Simple Component
Before we add another route, let's create a `Header` component to show up across all of our app's pages. 

In `src/App.js`:

```js
import React from 'react';
import Header from './components/Header';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import TodosContainer from './containers/TodosContainer';

function App() {
  return (
    <div className="container">
      <Header/>
      <Switch>
        <Route exact path='/' component={ Home }/>
        <Route path='/todos' component={ TodosContainer }/>
      </Switch>
    </div>
  );
};

export default App;
```

This will immediately error our code base out, why?

That's right, we don't actually have a `Header` component defined in our codebase. Let's create it:

```bash
$ touch src/components/Header.js
```

In `src/components/Header.js`:

```js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>ToDo</h1>
      <nav> 
        <Link to={'/'}>Home</Link>
        <Link to={'/todos'}>Todos</Link>
      </nav>
    </header>
  );
};

export default Header;
```

In this file, we've grabbed some dependencies and stored them in variables and then defined a component. The `Link` component is exactly what you think it is, a link to another route. You can think of it as an `href` in plain 'ol HTML.

Awesome! We now have a header showing up! Click between the `Home` and `Todos` links. It should route to your `Home` and `TodosContainer` components.

Before moving on, let's refactor so all our routes live neatly squared away in a separate file:

```bash
mkdir src/config/
touch src/config/routes.js
```

In your `config/routes.js` file, copy and paste the routes from your `App` component:

```js
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/Home';
import TodosContainer from '../containers/TodosContainer';

export default (
  <Switch>
    <Route exact path='/' component={ Home }/>
    <Route path='/todos' component={ TodosContainer }/>
  </Switch>
);
```

Then, edit your `App.js` file to no longer have hard-coded routes, and to reference the routes in your `config/routes.js` file instead. Much cleaner!!

```js
import React from 'react';
import Header from './components/Header';
import routes from './config/routes';

function App() {
  return (
    <div className="container">
      <Header/>
      { routes }
    </div>
  );
};

export default App;
```

Make sure your routes still work, before moving on.

Great! Now, let's talk about [Sprint 2: Containers](Sprint2.md)
