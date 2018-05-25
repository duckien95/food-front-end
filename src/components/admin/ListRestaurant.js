import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
const Service = new Services();

class ListRestaurant extends React.Component{
    constructor() {
        super();
        this.state  = {
            restaurants : [],
        }

    }

    componentDidMount(){
        this.setState({ restaurants : [] });
        axios.get(Service.getServerHostName() + "/api/restaurant-list")
        .then(res => {
            // console.log(res.data.data.length);
            this.setState({restaurants : res.data.data})
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        const { restaurants } = this.state;
        return(
            <div className="row">
                <table className="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success">
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">
                                <table className="table">
                                    <thead>
                                        <tr className="table-success">
                                            <th scope="col" className="res-street">Đường</th>
                                            <th scope="col" className="res-district">Quận</th>
                                            <th scope="col" className="res-city">Thành phố</th>
                                            <th scope="col" className="res-food-name">Tên món</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>

                            </th>
                            <th className="" scope="col">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        restaurants.map((rest,index) =>
                        <tr key={index} className=''>
                            <th scope="row" className="text-center">{index + 1}</th>
                            <td>{rest.restaurant_name}</td>

                            <td>

                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr className="admin">
                                            <th scope="col" className="d-none">Đường</th>
                                            <th scope="col" className="d-none">Quận</th>
                                            <th scope="col" className="d-none">Thành phố</th>
                                            <th scope="col" className="d-none">Món</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {rest.foods.map((food, index) =>
                                        <tr key={index}>
                                            <td className="res-street">{food.street_number + ', ' + food.street_name}</td>
                                            <td className="res-district">{food.district_name}</td>
                                            <td className="res-city">{food.city_name}</td>
                                            <td className="res-food-name">
                                                <div className="dropdown">
                                                    <div className="dropdown-toggle" data-toggle="dropdown">
                                                        <span className="text-danger">{food.food_in_address.length} món ăn</span>
                                                    </div>
                                                    <div className="dropdown-menu">

                                                        {
                                                            food.food_in_address.map( (fod, index) =>

                                                                <a key={index} href={"/food-info/" + fod.food_id} className="dropdown-item">{fod.food_name}</a>
                                                            )
                                                        }

                                                    </div>
                                                </div>

                                            </td>
                                        </tr>
                                        )}
                                    </tbody>
                                </table>

                            </td>
                            <td className="text-center">
                                <a href='' className="btn btn-primary a-admin-page"><i className="fa fa-edit"></i></a>
                                <button className="btn btn-danger mx-2"><i className="far fa-trash-alt"></i></button>
                            </td>

                        </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>

        )
    }

}

export default ListRestaurant;
