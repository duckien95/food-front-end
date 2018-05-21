import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
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
        return(
            <div className="col-md-12">
            <div className="row">
                <Food foods={this.state.foodList} />
            </div>
            </div>

        )
    }

}

export default FoodByCategory;
