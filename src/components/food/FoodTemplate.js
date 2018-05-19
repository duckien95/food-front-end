import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

class FoodList extends React.Component{

    render(){
        return(

            <div className="row">
            {
                this.props.foods.map((food,index) =>
                    <div className="col-xs-6 col-md-4 suggest px-1 py-1" key={index}>
                        <Link to={"/food-info/" + food.id}>
                            <div className="food-suggest">
                                <img  src={"https://drive.google.com/uc?export=view&id=" + (food.imageUrl.approve[0] ?  food.imageUrl.approve[0] : "19RNB4mhAvMXI_6ohPkYyc4l9Nv_OeMGW")} alt="" className="home-image" />

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
                                    </ul>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            }
            </div>


        )
    }

}

export default FoodList;
