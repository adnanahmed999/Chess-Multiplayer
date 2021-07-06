import React from 'react';
import MainPage from './mainPage/mainPage';
import {BrowserRouter as Router , Redirect, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <MainPage/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App