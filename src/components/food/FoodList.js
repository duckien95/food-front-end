import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
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
        axios.get(Service.getServerHostName() + "/api/food-list")
        .then(res => {
            console.log(res.data);
            this.setState({foodList : res.data.foods})
        }).catch(err => {
            console.log(err);
        })

        var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=105+Quán+Thánh+Ba+Đình+Hà+Nội&destinations=106+A7+Ngõ+A1+Tôn+Thất+Tùng+Đống Đa+Hà Nội&key=AIzaSyAPiN-8Q1QKqw4-tqwogebchry4_lIn97E';

        axios.get(url)
        .then(res => {
            console.log(res);
        })
        .catch(
            err => {
                console.log(err);
            }
        )
    }

    render(){
        return(
            <div className="col-md-12">
            <div className="row">
            {
                this.state.foodList.map((food,index) =>
                    <div className="col-xs-6 col-md-4 suggest px-1 py-1" key={index}>
                        <a href={"/food-info/" + food.id}>
                            <div className="food-suggest">
                                <img  src={"https://drive.google.com/uc?export=view&id=" + (food.imageUrl[0] ?  food.imageUrl[0] : "19RNB4mhAvMXI_6ohPkYyc4l9Nv_OeMGW")} alt="" className="home-image" />

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
                                        <li className="li-child-suggest">{'Đăng bởi ' + food.first_name}</li>
                                    </ul>
                                </div>
                            </div>
                        </a>
                    </div>
                )
            }
            </div>
            </div>

        )
    }

}

export default FoodList;
