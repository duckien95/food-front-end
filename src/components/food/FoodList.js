import React from 'react'
import axios from "axios"
import $ from "jquery"
import Services from "../service/Service.js"
import AuthService from '../authenticate/AuthService';
const Auth = new AuthService();
const Service = new Services();

class FoodList extends React.Component{
    constructor() {
        super();
        this.state  = {
            foodList : [],
        }

    }
    componentWillMount(){
    }

    componentDidMount(){
        console.log(Service.getServerHostName());
        axios.get(Service.getServerHostName() + "/api/food/list")
        .then(res => {
            console.log(res.data);
            this.setState({foodList : res.data.foods})
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        return(
            <div class="row">
            {
                this.state.foodList.map((food,index) =>
                    <div className="col-xs-6 col-sm-4 suggest px-1 py-1">
                        <a href={"/food/" + food.id}>
                            <div className="food-suggest">
                                <img  src={"https://drive.google.com/uc?export=view&id=" + (food.imageUrl[0] ?  food.imageUrl[0] : "1KmBSjWIfb_GixqM20hu6qfXKTX9rMo94")} alt="" className="home-image" />

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
                                        <li className="li-child-suggest">{ food.restaurant_name + ', ' + food.districtname + ', ' + food.cityname}</li>
                                        <li className="li-child-suggest">{'Đăng bởi ' + food.username}</li>
                                    </ul>
                                </div>
                            </div>
                        </a>
                    </div>
                )
            }
            </div>

        )
    }

}

export default FoodList;
