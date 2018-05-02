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
import EditUser from './components/authenticate/EditUser';

import FoodList from './components/food/FoodList';
import FoodCreate from './components/food/FoodCreate';
import FoodDetail from './components/food/FoodDetail';
import FoodEdit from './components/food/FoodEdit';
import FoodFavorite from './components/food/FoodFavorite';
import FoodLike from './components/food/FoodLike';
import FoodPost from './components/food/FoodPost';
import FoodByCategory from './components/food/FoodByCategory';
import Nearby from './components/food/Nearby';
import SearchResult from './components/food/SearchResult';

import Navbar from "./components/Navbar";
import Footer from './components/Footer';

import ListUser from './components/admin/ListUser';
import ListFood from './components/admin/ListFood';
import ListRestaurant from './components/admin/ListRestaurant';
import ListFoodPending from './components/admin/ListFoodPending';

import Test from './components/Test';
import LightboxExample from './components/Lightbox';

ReactDOM.render(
    <Router>
        <div className="container">
            <Navbar />
            <Route exact path="/" component={App} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/edit/:userId" component={EditUser} />
            <Route path="/food/list" component={FoodList} />
            <Route path="/food/create" component={FoodCreate} />
            <Route path="/food-info/:foodId" component={FoodDetail} />
            <Route path="/food/edit/:foodId" component={FoodEdit} />
            <Route path="/food-category/:categoryId" component={FoodByCategory} />
            <Route path="/food-favorite/:userId" component={FoodFavorite} />
            <Route path="/food-like/:userId" component={FoodLike} />
            <Route path="/food-post/:userId" component={FoodPost} />

            <Route path="/test" component={Test} />
            <Route path="/lightbox" component={LightboxExample} />
            <Route path="/search" component={SearchResult} />
            <Route path="/nearby/:place" component={Nearby} />
            <Route path="/admin/users" component={ListUser} />
            <Route path="/admin/foods" component={ListFood} />
            <Route path="/admin/restaurants" component={ListRestaurant} />
            <Route path="/admin/pending" component={ListFoodPending} />
            <Footer />
        </div>
    </Router>
    , document.getElementById('root')
);

// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
