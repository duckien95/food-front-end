import React from 'react'
import axios from "axios"
import { Link } from 'react-router-dom'
import Food from './FoodTemplate'
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
        console.log(this.props);
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

            <Food foods={this.state.foodList} />

            </div>

        )
    }

}

export default Nearby;
