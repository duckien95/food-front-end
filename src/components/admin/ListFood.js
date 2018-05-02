import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
const Service = new Services();

class ListFood extends React.Component{
    constructor() {
        super();
        this.state  = {
            foods : [],
        }

    }

    componentDidMount(){

        axios.get(Service.getServerHostName() + "/api/food-list")
        .then(res => {
            console.log(res.data);
            this.setState({foods : res.data.foods})
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        const { foods } = this.state;
        return(
            <div className="col-md-12">
                <table class="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success admin">
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Nhà Hàng</th>
                            <th scope="col">Địa điểm</th>
                            <th scope="col">Đăng bởi</th>
                            <th scope="col">Ảnh & Video</th>
                            <th scope="col">Lượt thích</th>
                            <th scope="col">Lượt lưu</th>
                            <th scope="col">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        foods.map((food,index) =>
                        <tr key={index} className='admin'>
                            <th scope="row">{index + 1}</th>
                            <td><a href={'/food-info/' +  food.id }>{food.name}</a></td>
                            <td>{food.restaurant_name}</td>
                            <td>{food.address}</td>
                            <td>{food.owner_name}</td>
                            <td className="td-image-video">
                                {food.imageUrl.approve.length && food.videoUrl.approve.length ?
                                    (<ul className="list-unstyled text-success">Đã duyệt
                                        {food.imageUrl.approve.length > 0 ? (<li key='1' className="text-success">{food.imageUrl.approve.length } ảnh</li>) : ''}
                                        {food.videoUrl.approve.length > 0 ? (<li key='2' className="text-success">{food.videoUrl.approve.length } video</li>) : ''}

                                    </ul>): ''
                                }
                                {food.imageUrl.pending.length || food.videoUrl.pending.length ?
                                    (<ul className="list-unstyled text-danger">Chờ duyệt
                                        {food.imageUrl.pending.length > 0 ? (<li key='1' className="text-danger">{food.imageUrl.pending.length } ảnh</li>) : ''}
                                        {food.videoUrl.pending.length > 0 ? (<li key='2' className="text-danger">{food.videoUrl.pending.length } video</li>) : ''}

                                    </ul>) : ''
                                }
                            </td>
                            <td>
                            <ul className="list-unstyled">
                            {
                                food.like.map( (fod, index) =>
                                    <li key={index}>
                                        <a href={'/admin/user/' +  fod.user_id }>{index+1 +  '. ' + fod.username}</a>
                                    </li>
                                )
                            }
                            </ul>
                            </td>
                            <td>
                            <ul className="list-unstyled">
                            {
                                food.favorite.map( (fod, index) =>
                                    <li key={index}>
                                        <a href={'/admin/user/' +  fod.user_id }>{index+1 +  '. ' + fod.username}</a>
                                    </li>
                                )
                            }
                            </ul>
                            </td>
                            <td>{
                                food.status === 'approve' ? (<span className="text-success">Đã duyệt</span>) : (<span className="text-danger">Chờ duyệt</span>)
                            }</td>
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
