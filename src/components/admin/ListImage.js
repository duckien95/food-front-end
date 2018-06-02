import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
import $ from 'jquery';
import {NotificationContainer, NotificationManager} from 'react-notifications'
const Service = new Services();


class ListImage extends React.Component{
    constructor() {
        super();
        this.state  = {
            images : [],
            category: [],
            foods: [],
            foodSelected: -1,
            cateSelected: -1,
            file_id: '',
            msg: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount(){
        // console.log(Service.getServerHostName());
        axios.get(Service.getServerHostName() + "/api/img/list")
        .then(res => {
            // console.log(res.data.data);
            this.setState({images : res.data.images})
        })

        axios.get(Service.getServerHostName() + "/api/list-food-name")
        .then(res => {
            // console.log(res.data.data);
            this.setState({foods : res.data.foods})
        })

        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            // console.log(res.data.data);
            this.setState({category : res.data.data})
        })
    }


    onDeleteImage = (food_id, file_id) => (e) => {
        e.preventDefault();
        axios.post(Service.getServerHostName() + '/food/image/disapprove/' + food_id + '/' + file_id)
        .then(
            res => {
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Ảnh được xóa')
                    axios.get(Service.getServerHostName() + "/api/img/list")
                    .then(res => {
                        this.setState({ images : res.data.images})
                    })
                }
                else {
                    NotificationManager.error('Có lỗi xảy ra', 'Ảnh chưa được xóa');
                }
            }
        )
    }

    onChange(e){
        const state = this.state;
        state[e.target.name] =  e.target.value;
        this.setState({ state });
    }

    onSearch(e){
        e.preventDefault();
        const { cateSelected, foodSelected } = this.state;
        axios.post(Service.getServerHostName() + '/api/img/search', { foodSelected, cateSelected })
        .then(
            res => {
                if(res.data.status === 'success'){
                    this.setState({ images : res.data.images})
                }
                else {
                    this.setState({ images: [], msg: res.data.msg })
                }
            }
        )
    }

    render(){
        var { images, foodSelected, cateSelected } = this.state;
        return(
            <div className="row">
                <NotificationContainer/>
                <div className="col-md-12">
                    <form onSubmit={this.onSearch} className="search-form">
                        <div className="form-row">
                            <div className="col-sm mb-1">
                                <select className="custom-select" name="foodSelected" onChange={this.onChange}>
                                    <option value="-1" selected>Tên món ăn</option>
                                    {
                                        this.state.foods.map((fos, index) =>
                                            Number(foodSelected) === fos.id ?
                                            (<option key={index} value={fos.id} selected>{fos.name}</option>)
                                            : (<option key={index} value={fos.id}>{fos.name}</option>)
                                        )
                                    }
                                </select>
                            </div>


                            <div className="col-sm mb-1">
                                <select className="custom-select" name="cateSelected" onChange={this.onChange} >
                                <option value="-1" selected>Loại món ăn</option>
                                {
                                    this.state.category.map((cat, index) =>
                                        Number(cateSelected) == cat.cate_id ?
                                        (<option key={index} value={cat.cate_id} selected>{cat.cate_name}</option>)
                                        : (<option key={index} value={cat.cate_id}>{cat.cate_name}</option>)
                                    )
                                }
                                </select>
                            </div>

                            <div className="col-sm mb-1">
                                <button className="search btn btn-primary" type="submit">Tìm kiếm</button>
                            </div>

                        </div>
                    </form>

                </div>
                <div className="text-center text-danger w-100 py-2" id="msg">{this.state.msg}</div>
                <table className="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success admin">
                            <th className="" scope="col">STT</th>
                            <th className="media-food-name" scope="col">Món</th>
                            <th className="media-street" scope="col">Đường</th>
                            <th className="media-district" scope="col">Quận</th>
                            <th className="media-city" scope="col">Thành phố</th>
                            <th className="text-center" scope="col">Ảnh</th>
                            <th className="media-status" scope="col">Trạng thái</th>
                            <th className="media-update" scope="col">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            images.map( (img, index) =>
                                <tr key={index}>

                                    <th className="text-center" scope="row">{index + 1}</th>
                                    <td>{ img.name }</td>
                                    <td>{ img.street_number + ', ' + img.street_name }</td>
                                    <td>{ img.district_name }</td>
                                    <td>{ img.city_name }</td>
                                    <td className="text-center">
                                        <img alt={img.file_id} src={"https://drive.google.com/uc?export=view&id=" + img.file_id } className="manage-img"/>
                                    </td>
                                    <td>
                                        {img.status === 'approve' ? (<span className="text-success">Đã duyệt</span>) : (<span className="text-danger">Chờ duyệt</span>)}
                                    </td>
                                    <td className="text-center">
                                        <a target='_blank' href={"https://drive.google.com/uc?export=view&id=" + img.file_id } className="btn btn-info mx-2"><i className="fas fa-film"></i></a>
                                        <button onClick={this.onDeleteImage(img.food_id, img.file_id)} className="btn btn-danger"><i className="far fa-trash-alt"></i></button>
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

export default ListImage;
