import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
import $ from 'jquery';
import {NotificationContainer, NotificationManager} from 'react-notifications'
const Service = new Services();

class ListRestaurant extends React.Component{
    constructor() {
        super();
        this.state  = {
            restaurants : [],
            new_res_name: ''
        }

        this.onChange = this.onChange.bind(this);
        this.onInvalid = this.onInvalid.bind(this);

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

    onDeleteRestaurant = (restaurant_id) => (e) => {
        e.preventDefault();
        console.log(restaurant_id);
    }

    onChange(e){
        this.setState({
            new_res_name: e.target.value
        })
    }

    onInvalid(e){
        if(e.target.value === ""){
            e.target.setCustomValidity('Trường này không được để trống');
        }
        else{
            e.target.setCustomValidity('');
        }
    }

    onUpdateResName = (restaurant_name) => (e) => {
        console.log(restaurant_name);
        var new_res_name = this.state.new_res_name;
        axios.post(Service.getServerHostName() + '/api/restaurant/update-name', {restaurant_name, new_res_name })
        .then(
            res => {
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Đổi tên nhà hàng');
                    $('.close').click();
                    axios.get(Service.getServerHostName() + "/api/restaurant-list")
                    .then(res => {
                        // console.log(res.data.data.length);
                        this.setState({restaurants : res.data.data})
                    })
                }
                else {
                    NotificationManager.error('Có lỗi xảy ra', 'Cập nhật không thành công');
                }
            }
        )
    }

    render(){
        const { restaurants } = this.state;
        return(
            <div className="row">
                <NotificationContainer/>
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
                                                    <div>
                                                    <button className="btn btn-danger" data-toggle="modal" data-target={"#deleteRes" +  food.restaurant_id}><i className="far fa-trash-alt"></i></button>
                                                    <div>
                                                        <div className="modal fade" id={"deleteRes" + food.restaurant_id} role="dialog">
                                                            <div className="modal-dialog modal-dialog-centered modal-md">
                                                              <div className="modal-content">
                                                                <div className="modal-header">
                                                                  <h4 className="modal-title text-center">Bạn có chắc chắn muốn xóa bài viết ?</h4>
                                                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <form onSubmit={this.onDeleteRestaurant(food.restaurant_id)} >
                                                                        <div className="form-group float-right">
                                                                            <button type="button" className="btn btn-info mx-2" data-dismiss="modal">Không</button>
                                                                            <button type="submit" className="btn btn-danger ">Có</button>
                                                                        </div>

                                                                    </form>

                                                                </div>
                                                              </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>

                                                </div>


                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>

                            </td>
                            <td className="text-center">
                                <button className="btn btn-primary" data-toggle="modal" data-target={"#updateRes" +  index}><i className="far fa-edit"></i></button>
                                <div>
                                    <div className="modal fade" id={"updateRes" + index} role="dialog">
                                        <div className="modal-dialog modal-dialog-centered modal-md">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h4 className="modal-title text-center">Chỉnh sửa tên nhà hàng</h4>
                                              <button type="button" className="close" data-dismiss="modal">&times;</button>
                                            </div>
                                            <div className="modal-body">

                                                <form onSubmit={this.onUpdateResName(rest.restaurant_name)} >
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" id="res-name"  onChange={this.onChange} onInvalid={this.onInvalid} required/>
                                                    </div>
                                                    <div className="form-group float-right">
                                                        <button type="button" className="btn btn-secondary mx-2 close" data-dismiss="modal">Thoát</button>
                                                        <button type="submit" className="btn btn-info">Cập nhật</button>
                                                    </div>

                                                </form>
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                </div>
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
