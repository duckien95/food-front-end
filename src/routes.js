import React from 'react';
import {BrowserRouter,  Route,  Switch} from 'react-router-dom';

import Welcome from './components/Wellcome';
import Home from './components/Home';
import Login from './components/Login';

const Routes = () => (
  <BrowserRouter >
      <Switch>
          <Route exact path="/" component={Welcome}/>
          <Route path="/home" component={Home}/>
          <Route exact path="/login" component={Login}/>
      </Switch>
  </BrowserRouter>
);

export default Routes;
