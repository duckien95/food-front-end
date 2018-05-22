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

            <div className="mrg-1">
            <div className="row">
            {
                foodList.map((food,index) =>
                    <div className="col-xs-6 col-md-4 suggest px-1 py-1" key={index}>
                        <Link to={"/food-info/" + food.id}>
                            <div className="food-suggest">
                                <img  src={"https://drive.google.com/uc?export=view&id=" + (food.avatar ?  food.avatar : "1obNJRB2U3ytGosbM-ADswthgaRMzDZNw")} alt="" className="home-image" />

                                <div className="food-detail-suggest">
                                    <div  className="icon-heart-suggest">
                                        <span   className="glyphicon glyphicon-heart"></span>
                                        <span  className="glyphicon glyphicon-heart"></span>
                                    </div>
                                    <ul className="food-detail-info-suggest">
                                        <li className="li-price-suggest"></li>
                                        <li className="li-child-suggest">
                                            <span> {food.name} </span>

                                        </li>
                                        <li className="li-child-suggest"><span> {food.prices}</span></li>
                                        <li className="li-child-suggest">{ food.street_number + ' ' + food.street_name + ', ' + food.district_name + ', ' + food.city_name }</li>
                                        {
                                            food.distance !== undefined ? (<li className="li-child-suggest">Khoảng cách {food.distance}</li>) : ''
                                        }
                                    </ul>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            }
            </div>
            </div>

        )
    }

}

export default FoodByCategory;
