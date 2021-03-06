import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
import ListFood from "./ListFood"
import ListUser from "./ListUser"
import ListFoodPending from "./ListFoodPending"
import ListFoodApprove from './ListFoodApprove'
import ListInteractive from './ListInteractive'
import ListRestaurant from "./ListRestaurant"
import ListMediaPending from "./ListMediaPending"
import ListImage from "./ListImage"
import ListVideo from "./ListVideo"
import $ from 'jquery'
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
        $('#root').addClass('remove-padding-bottom');
        $('.user-view').addClass('d-none');
    }

    render(){
        var { type } = this.state;
        return(
            <div className="d-flex flex-row border border-light border-left-0 border-right-0">

                <div className="col-md-2 main-color px-0">
                    <nav id="sidebar">
                      <div className="sidebar-header text-center">
                          Danh mục quản lý
                      </div>

                      <ul className="list-unstyled components">
                        <li className="border-top border-light active">
                            <a href="#foodlist" data-toggle="collapse" aria-expanded="false" className="nav-active">Quản lý thông tin ẩm thực</a>
                            <ul className="collapse list-unstyled pl-4" id="foodlist">
                                <li><a onClick={this.chooseType('food-list')} className="nav-active">Tất cả các món ăn</a></li>
                                <li><a onClick={this.chooseType('food-approve')} className="nav-active">Món ăn đã duyệt</a></li>
                                <li><a onClick={this.chooseType('food-pending')} className="nav-active">Món ăn mới đăng</a></li>
                                <li><a onClick={this.chooseType('food-interactive')} className="nav-active">Thống kê tương tác</a></li>
                                <li><a target='_blank'  href={'/food/create'} className="nav-active">Thêm món ăn</a></li>
                            </ul>
                        </li>
                        <li className="border-top border-light">
                            <a href="#media" data-toggle="collapse" aria-expanded="false" className="nav-active">Ảnh - video ẩm thực</a>
                            <ul className="collapse list-unstyled pl-4" id="media">
                                <li><a onClick={this.chooseType('image')} className="nav-active">Hình ảnh</a></li>
                                <li><a onClick={this.chooseType('video')} className="nav-active">Video</a></li>
                                <li><a onClick={this.chooseType('media-pending')} className="nav-active">Hình ảnh - video mới chia sẻ</a></li>
                            </ul>
                        </li>
                        <li className="border-top border-light">
                            <a onClick={this.chooseType('restaurant')} className="nav-active">Quản lý nhà hàng</a>
                        </li>
                        <li className="border-top border-light">
                            <a onClick={this.chooseType('user')} className="nav-active">Quản lý người dùng</a>
                        </li>
                        <li className="border-top border-light">
                            <a target="_blank" href="/food/list" className="nav-active">TRANG CHỦ</a>
                        </li>
                      </ul>

                    </nav>
                </div>

                <div id="content" className="col-md-10 pr-0">


                    <div className="table-wrapper">
                        <div>
                        {
                            type === 'food-list' ? <ListFood /> :
                            ( type === 'user' ? <ListUser /> :
                            ( type === 'restaurant' ? <ListRestaurant /> :
                            ( type === "food-pending" ? <ListFoodPending /> :
                            ( type === 'image' ? <ListImage /> :
                            ( type === 'video' ? <ListVideo /> :
                            ( type === 'food-interactive' ? <ListInteractive /> :
                            ( type === 'media-pending' ? <ListMediaPending /> : <ListFoodApprove />)))))))
                        }
                        </div>
                    </div>


                </div>


            </div>

        )
    }

}

export default AdminHome;
