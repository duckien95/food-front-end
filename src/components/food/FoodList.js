import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Food from './FoodTemplate';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Services from '../service/Service.js'
import AuthService from '../authenticate/AuthService.js';
const Service = new Services();
const Auth = new AuthService();


class FoodList extends React.Component{
    constructor(props) {
        super(props);
        this.state  = {
            foodList : [],
            user : JSON.parse(localStorage.getItem('user'))
        }

    }
    componentWillMount(){
        // Auth.logout();
        console.log(JSON.parse(localStorage.getItem('user')));

    }

    componentDidMount(){
        // console.log(this.props);
        if(Auth.loggedIn() && this.state.user.type === "admin"){
            if(window.location.path === '/'){
                window.location.replace('/admin/foods');
            }
            // this.props.history.replace('/admin/foods');
        }
        if(this.props.location !== undefined){
            var state = this.props.location.state;
            if(state !== undefined){
                // console.log(state);
                if(state.msg !== undefined){
                    NotificationManager.success(state.msg, state.title, state.timeOut);
                }
            }
            this.props.history.replace('/food/list', {})
        }



        // console.log(Service.getServerHostName());
        axios.get(Service.getServerHostName() + "/api/food-approve")
        .then(res => {
            // console.log(res.data);
            this.setState({foodList : res.data.foods})
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        return(
            <div>
                <NotificationContainer />
                <Food foods={this.state.foodList} />
            </div>
        )
    }

}

export default FoodList;
