import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
import Food from './FoodTemplate';
const Service = new Services();

class FoodLike extends React.Component{
    constructor() {
        super();
        this.state  = {
            foodList : [],
            title: "Danh sách các món ăn đã thích"
        }

    }

    componentDidMount(){
        console.log(Service.getServerHostName());
        axios.get(Service.getServerHostName() + "/api/food-like/" + this.props.match.params.userId)
        .then(res => {
            console.log(res.data);
            var data = res.data.foods;
            if(data.length){
                this.setState({foodList : data});
            }
            else{
                this.setState({foodList : []})
            }

        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        return(
            <Food foods={this.state.foodList} title={this.state.title}/>
        )
    }

}

export default FoodLike;
