import React from 'react';
import Onboard from './onboard/onboard';
import {BrowserRouter as Router , Redirect, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Onboard />
        </Route>
      </Switch>
    </Router>
  )
}

export default App