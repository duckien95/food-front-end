import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
import $ from 'jquery';
import {NotificationContainer, NotificationManager} from 'react-notifications'
const Service = new Services();


class ListUser extends React.Component{
    constructor() {
        super();
        this.state  = {
            users : [],
            permission: '',
            userid: ''
        }

        this.onChange = this.onChange.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
    }

    onChange(e) {
        console.log(e.target.value);
        this.setState({ permission : e.target.value });
    }

    onClickButton(e){
        this.setState({ userid : e.target.value });
    }

    onDeleteUser = (user_id) => (e) => {
        console.log(user_id);
        axios.post(Service.getServerHostName() + '/auth/delete/' + user_id)
        .then(
            res => {
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Xóa người dùng');
                    axios.get(Service.getServerHostName() + "/api/user-list")
                    .then(res => {
                        // console.log(res.data.data);
                        this.setState({users : res.data.data})
                    })
                }
                else {
                    NotificationManager.error('Có lỗi xảy ra', 'Xóa người dùng');
                }
            }
        )
    }

    onAddPermission = (user_id) => (e) => {
        e.preventDefault();
        // console.log(user_id);
        // console.log(e.target);
        // var userid = 2;
        const { permission } = this.state;

        axios.post(Service.getServerHostName() + '/api/change-permission/' + user_id + permission)
        .then(
            res => {
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Cấp quyền người dùng');
                    $('.close').click();
                    axios.get(Service.getServerHostName() + "/api/user-list")
                    .then(res => {
                        // console.log(res.data.data);
                        this.setState({users : res.data.data})
                    })

                }
                else {
                    NotificationManager.error('Có lỗi xảy ra', 'Cấp quyền người dùng');
                }
            }
        )
    }


    componentDidMount(){
        // console.log(Service.getServerHostName());
        axios.get(Service.getServerHostName() + "/api/user-list")
        .then(res => {
            console.log(res.data.data);
            this.setState({users : res.data.data})
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        const { users } = this.state;
        return(
            <div className="row">
                <NotificationContainer/>
                <table className="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success">
                            <th scope="col">STT</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Tên đăng nhập</th>
                            <th scope="col">Họ và tên</th>
                            <th scope="col">Quyền hạn</th>
                            <th scope="col">Thích</th>
                            <th scope="col">Lưu</th>
                            <th scope="col">Bài đăng</th>
                            <th scope="col">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        users.map((user,index) =>
                        <tr key={index} className='pending-table'>
                            <th scope="row" className="text-center">{index + 1}</th>
                            <td>{user.provider + ' ' + user.id}</td>
                            <td>{user.username ? user.username : user.email}</td>
                            <td> { user.last_name + ' ' + user.first_name }</td>
                            <td>
                                { user.type === 'normal' ? (<span>Người dùng</span>) : (<span className="text-danger">Quản trị viên</span>)}
                                <div>
                                  <div className="modal fade" id={"changePermission" + index} role="dialog">
                                    <div className="modal-dialog modal-dialog-centered modal-md" id="modalIV">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h4 className="modal-title text-center">Chỉnh sửa quyền truy cập</h4>
                                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={this.onAddPermission(user.id)} >

                                                <div className="form-check">
                                                    { user.type === 'admin' ?
                                                        (<input className="form-check-input" type="radio" name="Radios" id="Radios1" value='/admin' onChange={this.onChange} checked/>)
                                                        : (<input className="form-check-input" type="radio" name="Radios" id="Radios1" value='/admin' onChange={this.onChange}/>)}

                                                    <label className="form-check-label" htmlFor="Radios1">Admin</label>
                                                </div>

                                                <div className="form-check">
                                                    { user.type === 'normal' ?
                                                        (<input className="form-check-input" type="radio" name="Radios" id="Radios2" value='/normal' onChange={this.onChange} checked/>)
                                                        : (<input className="form-check-input" type="radio" name="Radios" id="Radios2" value='/normal' onChange={this.onChange} />) }

                                                    <label className="form-check-label" htmlFor="Radios3">Người dùng</label>
                                                </div>
                                                <div className="form-group float-right">
                                                    <button type="submit" className="btn btn-info">Cấp quyền</button>
                                                </div>

                                            </form>
                                        </div>

                                      </div>

                                    </div>
                                  </div>
                                  </div>
                            </td>
                            <td>
                            { user.like.length ?
                                (
                                    <div className="dropdown">
                                        <div className="dropdown-toggle" data-toggle="dropdown">
                                            <span className="text-danger">{user.like.length} bài viết</span>
                                        </div>
                                        <div className="dropdown-menu">
                                            {
                                                user.like.map( (like, index) =>
                                                    <a target="_blank" key={index} href={'/food-info/' +  like.id }  className="dropdown-item">{index+1 +  '. ' + like.name}</a>
                                                )
                                            }
                                        </div>
                                    </div>
                                ) : (<span className="text-primary">Chưa có</span>)
                            }
                            </td>
                            <td>
                            { user.favorite.length ?
                                (
                                <div className="dropdown">
                                    <div className="dropdown-toggle" data-toggle="dropdown">
                                        <span className="text-danger">{user.favorite.length} bài viết</span>
                                    </div>
                                    <div className="dropdown-menu">
                                        {
                                            user.favorite.map( (fav, index) =>
                                                <a target="_blank" key={index} href={'/food-info/' +  fav.id }  className="dropdown-item">{index+1 +  '. ' + fav.name}</a>
                                            )
                                        }
                                    </div>
                                </div>) : (<span className="text-primary">Chưa có</span>)}
                            </td>
                            <td>
                            { user.post.length ?
                                (
                                <div className="dropdown">

                                    <div className="dropdown-toggle" data-toggle="dropdown">
                                        <span className="text-danger">{user.post.length} bài viết</span>
                                    </div>
                                    <div className="dropdown-menu">
                                        {
                                            user.post.map( (pst, index) =>
                                                <a target="_blank" key={index} href={'/food-info/' +  pst.id }  className="dropdown-item">{index+1 +  '. ' + pst.name}</a>
                                            )
                                        }
                                    </div>
                                </div>) : (<span className="text-primary">Chưa có</span>)}
                            </td>
                            <td className="text-center">
                                <a target='_blank' href={'/edit/' + user.id} className="btn btn-primary"><i className="fa fa-edit"></i></a>
                                <button type="button" className="btn btn-success mx-2" data-toggle="modal" data-target={"#changePermission" +  index} value={user.id} onClick={this.onClickButton}>
                                    <i className="fa fa-address-book"></i>
                                </button>
                                <button onClick={this.onDeleteUser(user.id)} className="btn btn-danger"><i className="far fa-trash-alt"></i></button>
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

export default ListUser;
