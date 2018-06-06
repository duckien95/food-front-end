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
            category_name: ''
        }

    }


    componentDidMount(){
        // console.log(Service.getServerHostName());
        var categoryId = this.props.match.params.categoryId;
        console.log(categoryId);
        axios.get(Service.getServerHostName() + "/api/food-category/" + categoryId)
        .then(res => {
            this.setState({foodList : res.data.foods})
        })

        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            // console.log("res of food category");
            console.log(res.data);

            this.setState({category_name : res.data.data[categoryId -1].cate_name})
        })

    }

    render(){
        const {foodList, category_name} = this.state;
        return(
            <div>
                <Food foods={this.state.foodList} title={'' + category_name}/>
            </div>
        )
    }

}

export default FoodByCategory;
