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
            videos : [],
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
        axios.get(Service.getServerHostName() + "/api/video/list")
        .then(res => {
            // console.log(res.data.data);
            this.setState({videos : res.data.videos })
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
        axios.post(Service.getServerHostName() + '/food/video/disapprove/' + food_id + '/' + file_id)
        .then(
            res => {
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Video được xóa')
                    axios.get(Service.getServerHostName() + "/api/video/list")
                    .then(res => {
                        this.setState({ videos : res.data.videos })
                    })
                }
                else {
                    NotificationManager.error('Có lỗi xảy ra', 'Video chưa được xóa');
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
        axios.post(Service.getServerHostName() + '/api/video/search', { foodSelected, cateSelected })
        .then(
            res => {
                if(res.data.status === 'success'){
                    this.setState({ videos : res.data.videos })
                }
                else {
                    this.setState({ videos: [], msg: res.data.msg })
                }
            }
        )
    }

    render(){
        var { videos, foodSelected, cateSelected } = this.state;
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
                            <th scope="col">STT</th>
                            <th className="media-food-name" scope="col">Món</th>
                            <th className="media-street" scope="col">Đường</th>
                            <th className="media-district" scope="col">Quận</th>
                            <th className="media-city" scope="col">Thành phố</th>
                            <th className="text-center" scope="col">Video</th>
                            <th className="media-status" scope="col">Trạng thái</th>
                            <th className="media-update" scope="col">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            videos.map( (video, index) =>
                                <tr key={index}>

                                    <th className="text-center media-index" scope="row">{index + 1}</th>
                                    <td>{ video.name }</td>
                                    <td>{ video.street_number + ', ' + video.street_name }</td>
                                    <td>{ video.district_name }</td>
                                    <td>{ video.city_name }</td>
                                    <td>
                                        { video.file_id }
                                        <iframe className="w-100 video-drive" title={index} src={"https://drive.google.com/file/d/" + video.file_id + "/preview"}></iframe>
                                    </td>
                                    <td>
                                        {video.status === 'approve' ? (<span className="text-success">Đã duyệt</span>) : (<span className="text-danger">Chờ duyệt</span>)}
                                    </td>
                                    <td className="text-center">
                                        <a target='_blank' href={"https://drive.google.com/file/d/" + video.file_id +  "/preview" } className="btn btn-info mx-2"><i className="fas fa-film"></i></a>
                                        <button onClick={this.onDeleteImage(video.food_id, video.file_id)} className="btn btn-danger"><i className="far fa-trash-alt"></i></button>
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
