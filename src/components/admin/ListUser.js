import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
const Service = new Services();

class ListUser extends React.Component{
    constructor() {
        super();
        this.state  = {
            users : [],
            permission: '',
            userid: ''
        }

        this.onAddPermission = this.onAddPermission.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
    }

    onChange(e) {
        this.setState({ permission : e.target.value });
    }

    onClickButton(e){
        this.setState({ userid : e.target.value });
    }

    onAddPermission(e){
        e.preventDefault();
        console.log(this.state.permission);
        // console.log(e.target);
        // var userid = 2;
        const {userid, permission } = this.state;

        axios.post(Service.getServerHostName() + '/api/change-permission/' + userid + permission)
        .then(
            res => {
                if(res.data.status === 'success'){
                    window.location.reload('/admin/users');
                }
                console.log(res);
            }
        )
    }
    componentWillMount(){

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
                <table className="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success">
                            <th scope="col">STT</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Email</th>
                            <th scope="col">Quyền truy cập</th>
                            <th scope="col">Thích</th>
                            <th scope="col">Lưu</th>
                            <th scope="col">Bài đăng</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        users.map((user,index) =>
                        <tr key={index} className='pending-table'>
                            <th scope="row">{index + 1}</th>
                            <td>{user.provider}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.type === 'technician' ? 'Kĩ thuật viên' : (user.type === 'normal' ? 'Người dùng' : 'Admin')}
                                <div>
                                <button type="button" className="btn btn-success max-width" data-toggle="modal" data-target="#myModal" value={user.id} onClick={this.onClickButton}>Cấp quyền</button>


                                  <div className="modal fade" id="myModal" role="dialog">
                                    <div className="modal-dialog modal-dialog-centered modal-md" id="modalIV">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h4 className="modal-title text-center">Chỉnh sửa quyền truy cập</h4>
                                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={this.onAddPermission} >

                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="Radios" id="Radios1" value='/admin' onChange={this.onChange}/>
                                                    <label className="form-check-label" htmlFor="Radios1">Admin</label>
                                                    </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="Radios" id="Radios2" value='/technician' onChange={this.onChange}/>
                                                    <label className="form-check-label" htmlFor="Radios2">Kĩ thuật viên</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="Radios" id="Radios3" value='/normal' onChange={this.onChange} />
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
                                <div class="dropdown">

                                    <div class="dropdown-toggle" data-toggle="dropdown">
                                        <span className="text-primary">{user.like.length} bài viết</span>
                                    </div>
                                    <div class="dropdown-menu">
                                        {
                                            user.like.map( (like, index) =>
                                                <a key={index} href={'/food-info/' +  like.id }  class="dropdown-item">{index+1 +  '. ' + like.name}</a>
                                            )
                                        }
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="dropdown">

                                    <div class="dropdown-toggle" data-toggle="dropdown">
                                        <span className="text-primary">{user.favorite.length} bài viết</span>
                                    </div>
                                    <div class="dropdown-menu">
                                        {
                                            user.favorite.map( (fav, index) =>
                                                <a key={index} href={'/food-info/' +  fav.id }  class="dropdown-item">{index+1 +  '. ' + fav.name}</a>
                                            )
                                        }
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="dropdown">

                                    <div class="dropdown-toggle" data-toggle="dropdown">
                                        <span className="text-primary">{user.post.length} bài viết</span>
                                    </div>
                                    <div class="dropdown-menu">
                                        {
                                            user.post.map( (pst, index) =>
                                                <a key={index} href={'/food-info/' +  pst.id }  class="dropdown-item">{index+1 +  '. ' + pst.name}</a>
                                            )
                                        }
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

export default ListUser;
