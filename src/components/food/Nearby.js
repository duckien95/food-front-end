import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
const Service = new Services();

class Nearby extends React.Component{
    constructor() {
        super();
        this.state  = {
            foodList : [],
            origin: '',
            info: ''
        }

    }

    componentDidMount(){
        // console.log("props : " + this.props);
        // console.log(this.props);
        // console.log(window.location);
        var origin = this.props.match.params.place;
        var locationData = this.props.location.state;
        var originUrl = origin.split('-').join(' ');
        axios.get(Service.getServerHostName() + "/api/food-nearby/" + originUrl + '/' + locationData.food_id)
        .then(res => {
            console.log(res.data);
            this.setState({foodList : res.data.data, origin : originUrl, info: locationData })
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        return(
            <div className="col-md-12">
            <div className="text-center mb-3">
                <div className="nearby-title">Địa điểm ở gần</div>
                <div className="nearby-header">{this.state.info.res_name}</div>
                <div>{this.state.info.origin}</div>
            </div>

            <div className="row">
            {
                this.state.foodList.map((food,index) =>
                    <div className="col-xs-6 col-md-4 suggest px-1 py-1" key={index}>
                        <a href={"/food-info/" + food.id}>
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
                                        <li className="li-child-suggest">{'Khoảng cách ' + food.distance}</li>
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

export default Nearby;
