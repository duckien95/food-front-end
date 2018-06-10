import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Services from '../service/Service'
const Service = new Services();

class FoodList extends React.Component{
    constructor(props) {
        super(props);
        // https://drive.google.com/open?id=10s_fMmg2sdEocCqCC2oYOS6Y4g57bwxw
        // https://drive.google.com/open?id=17fYtPP2UBZ57cYhMKEOEl-OkF3hoEb-d
        // https://drive.google.com/open?id=1xh9vD6Ne6wHM5g8_bxO-tCuwDqvOXwhq
    }

    render(){
        return(
            <div className="mb-4">
                <div className="text-center title-header">{this.props.title}</div>
                <div className="row">
                {
                    this.props.foods.map((food,index) =>
                        <div className="col-xs-6 col-md-4 px-1 py-1" key={index}>
                            <Link to={"/food-info/" + food.id} className="food-suggest">
                                <div>
                                    <img  src={Service.getServerHostName() + "/images/index.jpg"} className="home-image" />
                                </div>
                                <div className="food-detail-info px-2">
                                        <div className="food-title-name">
                                            <span> {food.name} </span>

                                        </div>
                                        <div className="">
                                            <span>
                                                { Service.formatMoney(`${food.min_price}`) + (Number(food.max_price) > 0 ? (' - ' + Service.formatMoney(`${food.max_price}`)) : '') } VND
                                            </span>
                                        </div>
                                        <div className="">{ food.street_number + ' ' + food.street_name + ', ' + food.district_name + ', ' + food.city_name }</div>
                                        {
                                            food.distance !== undefined ? (<div className="li-child-suggest">Khoảng cách {food.distance}</div>) : ''
                                        }
                                        <div className="index-color"> {food.likes} lượt thích <i className="fas fa-heart"></i></div>

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

export default FoodList;
