import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';

import { Route, BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Login from './components/authenticate/Login';
import SignUp from './components/authenticate/SignUp';
import FoodList from './components/food/FoodList';
import FoodCreate from './components/food/FoodCreate';
import FoodDetail from './components/food/FoodDetail';
import FoodEdit from './components/food/FoodEdit';
import FoodFavorite from './components/food/FoodFavorite';
import FoodByCategory from './components/food/FoodByCategory';
import Nearby from './components/food/Nearby';
import SearchResult from './components/food/SearchResult';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import Test from './components/Test'

ReactDOM.render(
    <Router>
        <div className="container">
            <Navbar />
            <Route exact path="/" component={App} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/food/list" component={FoodList} />
            <Route path="/food/create" component={FoodCreate} />
            <Route path="/food-info/:foodId" component={FoodDetail} />
            <Route path="/food/edit/:foodId" component={FoodEdit} />
            <Route path="/food-category/:categoryId" component={FoodByCategory} />
            <Route path="/food-favorite/:userId" component={FoodFavorite} />
            <Route path="/test" component={Test} />
            <Route path="/search" component={SearchResult} />
            <Route path="/nearby/:place" component={Nearby} />
            <Footer />
        </div>
    </Router>
    , document.getElementById('root')
);

// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
