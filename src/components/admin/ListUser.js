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
                <table class="table table-bordered table-light table-hover">
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
                                <button type="button" class="btn btn-success max-width" data-toggle="modal" data-target="#myModal" value={user.id} onClick={this.onClickButton}>Cấp quyền</button>


                                  <div class="modal fade" id="myModal" role="dialog">
                                    <div class="modal-dialog modal-dialog-centered modal-md" id="modalIV">
                                      <div class="modal-content">
                                        <div class="modal-header">
                                          <h4 class="modal-title text-center">Chỉnh sửa quyền truy cập</h4>
                                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div class="modal-body">
                                            <form onSubmit={this.onAddPermission} >

                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="Radios" id="Radios1" value='/admin' onChange={this.onChange}/>
                                                    <label class="form-check-label" for="Radios1">Admin</label>
                                                    </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="Radios" id="Radios2" value='/technician' onChange={this.onChange}/>
                                                    <label class="form-check-label" for="Radios2">Kĩ thuật viên</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="Radios" id="Radios3" value='/normal' onChange={this.onChange} />
                                                    <label class="form-check-label" for="Radios3">Người dùng</label>
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
                            <ul className="list-unstyled">
                            {
                                user.like.map( (like, index) =>
                                    <li key={index}>
                                        <a href={'/food-info/' +  like.id }>{index+1 +  '. ' + like.name}</a>
                                    </li>
                                )
                            }
                            </ul>
                            </td>
                            <td>
                            <ul className="list-unstyled">
                            {
                                user.favorite.map( (like, index) =>
                                    <li key={index}>
                                        <a href={'/food-info/' +  like.id }>{index+1 +  '. ' + like.name}</a>
                                    </li>
                                )
                            }
                            </ul>
                            </td>
                            <td>
                            <ul className="list-unstyled">
                            {
                                user.post.map( (like, index) =>
                                    <li key={index}>
                                        <a href={'/food-info/' +  like.id }>{index+1 +  '. ' + like.name}</a>
                                    </li>
                                )
                            }
                            </ul>
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
