import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
import Food from './FoodTemplate';
const Service = new Services();

class FoodInRestaurant extends React.Component{
    constructor() {
        super();
        this.state  = {
            restaurants : [],
            foods: [],
            restaurant_name: ''
        }

    }

    componentDidMount(){
        var restaurant_name = this.props.match.params.restaurant_name;
        axios.get(Service.getServerHostName() + '/api/food-in-one-restaurant/' + restaurant_name)
        .then(
            res => {
                console.log(res.data.restaurants);
                this.setState({ restaurants: res.data.restaurants, restaurant_name: restaurant_name });
            }
        )
    }

    render(){
        const { restaurants, foods, restaurant_name } = this.state;
        return(
            <div className="mrg-15 px-0">
            <div className="title-header text-center">Nhà hàng {restaurant_name}</div>
            {
                restaurants.map((res, index) =>
                    <div className="col-md-12">
                        <div className="title-restaurant">
                            {res.street_number + ', ' + res.street_name + ', ' + res.district_name}
                        </div>
                        <Food foods={res.food_in_address} />
                    </div>
                )
            }
            </div>

        )
    }

}

export default FoodInRestaurant;
