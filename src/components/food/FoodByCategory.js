import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
import { Link } from 'react-router-dom'
import Food from './FoodTemplate'
const Service = new Services();

class FoodByCategory extends React.Component{
    constructor() {
        super();
        this.state  = {
            foodList : [],
        }

    }


    componentDidMount(){
        // console.log(Service.getServerHostName());
        var categoryId = this.props.match.params.categoryId;
        console.log(categoryId);
        axios.get(Service.getServerHostName() + "/api/food-category/" + categoryId)
        .then(res => {
            // console.log("res of food category");
            // console.log(res.data);
            this.setState({foodList : res.data.foods})
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        const {foodList} = this.state;
        return(
            <div>
                <Food foods={this.state.foodList} />
            </div>
        )
    }

}

export default FoodByCategory;
