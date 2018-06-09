import React from 'react'
import axios from "axios"
import { Link } from 'react-router-dom'
import Services from "../service/Service.js"
import $ from 'jquery'
import {NotificationContainer, NotificationManager} from 'react-notifications'
const Service = new Services();

class ListFood extends React.Component{
    constructor() {
        super();
        this.state  = {
            foods : [],
            district: [],
            cate: [],
            districtSelected: -1,
            category: -1,
            content: '',
            status: 'approve'
        }
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
        this.handleCateChange = this.handleCateChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount(){

        axios.get(Service.getServerHostName() + "/api/admin/food-interactive")
        .then(res => {
            // console.log(res.data);
            this.setState({foods : res.data.foods})
        }).catch(err => {
            console.log(err);
        })

        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            this.setState({ cate : res.data.data })
        })

        axios.get(Service.getServerHostName() + '/api/district/list').then(res => {
            // console.log(res.data.data[1]);
            this.setState({ district: res.data.data[1] });
        });


    }

    onDeletePost = (food_id) => (e) => {
        e.preventDefault();
        console.log(food_id);
        axios.get(Service.getServerHostName() + '/api/food/' + food_id)
        .then(
            res => {
                var listFileId = res.data.data.listFileId;
                axios.post(Service.getServerHostName() + '/food/delete/', { food_id, listFileId })
                .then(res => {

                    if(res.data.status === 'success'){
                        // this.props.history.replace('/food/list', { msg : 'Thành công', title: 'Xóa bài viết', timeOut: 2000 })
                        NotificationManager.success('Thành công', 'Xóa bài viết', 3000);
                        $('.close').click();
                        axios.get(Service.getServerHostName() + "/api/admin/food-interactive")
                        .then(res => {
                            // console.log(res.data);
                            this.setState({foods : res.data.foods})
                        })
                    }
                    else {
                        NotificationManager.error('Bài viết chưa được xóa', 'Có lỗi xảy ra');
                    }

                })
            }
        )
    }

    handleDistrictChange(e){
        var districtID =  e.target.value
        this.setState({districtSelected : districtID});
    }

    handleCateChange(e) {
        // var cate_id = e.target.value;
        this.setState({ category : e.target.value });

    }

    onChange (e){
        const state = this.state;
        state[e.target.name] = e.target.value;
        e.target.setCustomValidity('');
        this.setState(state);
    }

    onSearch(e){
        e.preventDefault();

        const { districtSelected, category, content, status } = this.state;
        var data = { districtSelected, category, content, status};
        axios.post(Service.getServerHostName() + '/api/admin/food-search', data)
        .then(res => {
            // console.log(res);
            if(res.status === 200){
                // localStorage.setItem('search', JSON.stringify(res.data.data));
                console.log(res.data);
                this.setState({
                    foods : res.data.foods
                });

                if(content.length){
                    this.setState({
                        category: -1,
                        districtSelected: -1
                    })
                }

            }
        })

    }

    render(){
        var { districtSelected, category, foods } = this.state;
        return(
            <div className="">
            <NotificationContainer/>
            <div className="">
                <div className="text-center" id="msg">{this.state.msg}</div>
                <form onSubmit={this.onSearch} className="search-form">
                    <div className="form-row">
                        <div className="col-sm mb-1">
                            <select className="custom-select" name="district" onChange={this.handleDistrictChange} onInvalid={this.onInvalid}>
                                <option value="-1" selected>Quận/Huyện</option>
                                {
                                    this.state.district.map((dist, index) =>
                                        Number(districtSelected) === dist.district_id ?
                                        (<option key={index} value={dist.district_id} selected>{dist.district_name}</option>)
                                        : (<option key={index} value={dist.district_id}>{dist.district_name}</option>)
                                    )
                                }
                            </select>
                        </div>


                        <div className="col-sm mb-1">
                            <select className="custom-select" name="category" onChange={this.handleCateChange} >
                            <option value="-1" selected>Loại món ăn</option>
                            {
                                this.state.cate.map((cat, index) =>
                                    Number(category) == cat.cate_id ?
                                    (<option key={index} value={cat.cate_id} selected>{cat.cate_name}</option>)
                                    : (<option key={index} value={cat.cate_id}>{cat.cate_name}</option>)
                                )
                            }
                            </select>
                        </div>

                        <div className="col-sm mb-1">
                            <input className="search" name="content" onChange={this.onChange} placeholder="Nhập tên món ăn" aria-label="Search" />
                        </div>
                        <div className="col-sm mb-1">
                            <button className="search btn btn-info" type="submit">Tìm kiếm</button>
                        </div>

                    </div>
                </form>

            </div>
                <table className="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success admin">
                            <th className="" scope="col">STT</th>
                            <th className="" scope="col">Tên</th>
                            <th className="" scope="col">Nhà Hàng</th>
                            <th className="" scope="col">Đường</th>
                            <th className="" scope="col">Quận</th>
                            <th className="" scope="col">Thành phố</th>
                            <th className="" scope="col">Thích</th>
                            <th className="" scope="col">Lưu</th>
                            <th className="" scope="col">Bình luận</th>
                            <th className="" scope="col">Trạng thái</th>
                            <th className="" scope="col">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        foods.map((food,index) =>
                        <tr key={index} className='admin'>
                            <th className="text-center" scope="row">{index + 1}</th>
                            <td className="food_name"><a href={'/food-info/' +  food.id }>{food.name}</a></td>
                            <td className="food_restaurant">{food.restaurant_name}</td>
                            <td className="food_street">{food.street_number + ', ' + food.street_name}</td>
                            <td className="food_district">{food.district_name}</td>
                            <td className="food_city">{food.city_name}</td>
                            <td className="">

                                { food.like.length ?
                                    (
                                        <div className="dropdown">
                                            <div className="dropdown-toggle" data-toggle="dropdown">
                                                <span className="text-danger">{food.like.length} lượt</span>
                                            </div>
                                            <div className="dropdown-menu">
                                                {
                                                    food.like.map( (like, index) =>
                                                        <a key={index} href=''  className="dropdown-item">{index + 1 +  '. ' + like.username}</a>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ) : (<span className="text-primary">Không</span>)
                                }

                            </td>
                            <td className="">

                                { food.favorite.length ?
                                    (
                                        <div className="dropdown">
                                            <div className="dropdown-toggle" data-toggle="dropdown">
                                                <span className="text-danger">{food.favorite.length} lượt</span>
                                            </div>
                                            <div className="dropdown-menu">
                                                {
                                                    food.favorite.map( (fav, index) =>
                                                        <a key={index} href=''  className="dropdown-item">{index + 1 +  '. ' + fav.username}</a>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ) : (<span className="text-primary">Không</span>)
                                }

                            </td>
                            <td className="">

                                { food.comment.length ?
                                    (
                                        <div className="dropdown">
                                            <div className="dropdown-toggle" data-toggle="dropdown">
                                                <span className="text-danger">{food.comment.length} lượt</span>
                                            </div>
                                        </div>
                                    ) : (<span className="text-primary">Không</span>)
                                }

                            </td>
                            <td className="food_status">
                                {
                                    food.status === 'approve' ? (<span className="text-success">Đã duyệt</span>) : (<span className="text-danger">Chờ duyệt</span>)
                                }
                            </td>

                            <td className="text-center">
                                <a target='_blank' href={'/food/edit/' + food.id} className="btn btn-primary a-admin-page"><i className="fa fa-edit"></i></a>
                                <a target='_blank' href={'/food-info/' + food.id} className="btn btn-info a-admin-page mx-2"><i className="far fas fa-desktop"></i></a>
                                <button className="btn btn-danger" data-toggle="modal" data-target={"#deletePost" +  index}><i className="far fa-trash-alt"></i></button>
                                <div>
                                    <div className="modal fade" id={"deletePost" + index} role="dialog">
                                        <div className="modal-dialog modal-dialog-centered modal-md">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h4 className="modal-title text-center">Bạn có chắc chắn muốn xóa bài viết ?</h4>
                                              <button type="button" className="close" data-dismiss="modal">&times;</button>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.onDeletePost(food.id)} >
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

export default ListFood;
