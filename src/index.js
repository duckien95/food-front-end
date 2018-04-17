import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './stylesheet/bootstrap.min.css'
import './stylesheet/style.css'
import { Route, BrowserRouter, Router } from 'react-router-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Login from './components/authenticate/Login';
import SignUp from './components/authenticate/SignUp';
import FoodList from './components/food/FoodList';
import FoodCreate from './components/food/FoodCreate';
import FoodDetail from './components/food/FoodDetail';

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/food/list" component={FoodList} />
            <Route path="/food/create" component={FoodCreate} />
            <Route path="/food/:foodId" component={FoodDetail} />
        </div>
    </BrowserRouter>
    , document.getElementById('root')
);

// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
