import React, { Component } from 'react';
import './App.css';
import FoodList from './components/food/FoodList'
import AuthService from './components/authenticate/AuthService';
const Auth = new AuthService();

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            appName: "Login with Facebook and Google using ReactJS and RESTful APIs",
            user : JSON.parse(localStorage.getItem('user')),
            home: false
        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    componentWillMount(){
        if(!Auth.loggedIn()){
            console.log("user not loggin");
        }

        // console.log(this.props);
    }
    componentDidMount(){
        console.log(this.props);
        // var user = JSON.parse(localStorage.getItem('user'));
        // console.log(user);
    }


    handleLogout(){
        Auth.logout()
        // console.log("history= " + this.props.history);
        // this.props.history.replace('/login');
    }

    render() {
        return (
            <div className="App">

                <p className="App-intro">
                </p>
                <FoodList />
            </div>


        );
    }
}

export default App;
