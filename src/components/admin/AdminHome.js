import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
import ListFood from "./ListFood"
import ListUser from "./ListUser"
import ListFoodPending from "./ListFoodPending"
import ListRestaurant from "./ListRestaurant"
const Service = new Services();


class AdminHome extends React.Component{
    constructor() {
        super();
        this.state  = {
            foods : [],
            type: 'food-list',
            numberPending: 1
        }
    }

    chooseType = (type_name) => (e) => {
        this.setState({ type: type_name });
    }

    componentDidMount(){

    }

    render(){
        var { type } = this.state;
        return(
            <div className="row">

                <div className="col-md-2 main-color border border-light px-0">
                    <nav id="sidebar">
                      <div className="sidebar-header text-center">
                          Danh mục quản lý
                      </div>

                      <ul className="list-unstyled components">
                        <li className="border-top border-light active">
                            <a href="#foodlist" data-toggle="collapse" aria-expanded="false" className="nav-active">Quản lý bài viết</a>
                            <ul className="collapse list-unstyled" id="foodlist">
                                <li><a onClick={this.chooseType('food-list')} className="nav-active">Tất cả các bài viết</a></li>
                                <li><a onClick={this.chooseType('food-approve')} className="nav-active">Bài viết đã duyệt</a></li>
                                <li>
                                    <a onClick={this.chooseType('food-pending')} className="nav-active">
                                        Bài viết chờ duyệt
                                        <span className="badge badge-light mx-1">{this.state.numberPending > 0 ? this.state.numberPending : ''}</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="border-top border-light">
                            <a href="/amdin/img-video" className="nav-active">Quản lý hình ảnh/video</a>
                        </li>
                        <li className="border-top border-light">
                            <a onClick={this.chooseType('restaurant')} className="nav-active">Quản lý nhà hàng</a>
                        </li>
                        <li className="border-top border-light">
                            <a onClick={this.chooseType('user')} className="nav-active">Quản lý người dùng</a>
                        </li>
                        <li className="border-top border-light">
                            <a href="#" className="nav-active">Contact</a>
                        </li>
                      </ul>

                    </nav>
                </div>

                <div id="content" className="col-md-10 border border-left-0 border-light px-2">


                    <div className="table-wrapper px-1">
                        <div>
                        {
                            type === 'food-list' ? <ListFood /> :
                            (type === 'user' ? <ListUser /> :
                            ( type === 'restaurant' ? <ListRestaurant /> :
                            ( type === "food-pending" ? <ListFoodPending /> : '')))
                        }
                        </div>
                    </div>


                </div>


            </div>

        )
    }

}

export default AdminHome;
