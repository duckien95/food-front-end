import React from 'react';
import AuthService from './AuthService';
import { Link } from 'react-router-dom';
import axios from 'axios'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Services from '../service/Service.js'
import $ from "jquery";

const Service = new Services();

class EditUser extends React.Component {

	constructor(props) {
		super(props);
		this.localhost = "http://localhost:8000";
        this.temp = [];
		this.state = {
            userId: this.props.match.params.userId,
            username: '',
			firstname: '',
            lastname: '',
            email: '',
			provider: '',
			type: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
			message:''
        }

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onInvalid = this.onInvalid.bind(this);
        this.Auth = new AuthService();
	}

	componentDidMount(){
		$('#msg')[0].style.visibility='hidden';
        var data = JSON.parse(localStorage.getItem('user'));
		axios.get(Service.getServerHostName() + '/api/user/' + this.props.match.params.userId)
		.then(
			res => {
				console.log(res);
				var user = res.data.data;
				this.setState({
					firstname: user.first_name,
					lastname: user.last_name,
					email: user.email,
					provider: user.provider,
					type: user.type
				});
			}
		)
	}


	onChange (e){
		const state = this.state;
		state[e.target.name] = e.target.value;
		e.target.setCustomValidity('');
		this.setState(state);
	}

	onSubmit(e) {
		e.preventDefault();
		const { userId, firstname, lastname, email, oldPassword, newPassword, confirmPassword, username, provider, type} = this.state;

		if(oldPassword || newPassword || confirmPassword){
			// alert('okkk')
			if(oldPassword){
	            if(confirmPassword !==  newPassword){
	                // alert('mat khau khong khop')
	                this.setState({message: "Mật khẩu mới không khớp"});
	                return;
	            }
	        }
			else {
				this.setState({message: "Bạn chưa điền mật khẩu cũ"});
				return;
			}
		}

        console.log('oldpass : ' + oldPassword);
        var editData = {
            userId : userId,
            firstname : firstname,
            lastname : lastname,
            email : email,
            oldPassword : oldPassword,
            newPassword : newPassword,
            confirmPassword : confirmPassword,
        };

        this.Auth.editUser(editData)
        .then(
            res => {
                console.log(res);
                if(!res.success){
                    this.setState({ message : res.msg})
                }
                else{
					this.props.history.replace('/');
					NotificationManager.success('Thành công', 'Thay đổi thông tin', 3000)
                }

            }
        ).catch(
            err =>{
                alert(err);
            }
        )
        console.log('valid form');

	}

	onInvalid(e){

		e.target.setCustomValidity("");
		if(e.target.name === "email"){
			if (!e.target.validity.valid) {
				e.target.setCustomValidity("Email không hợp lệ, vui lòng nhập lại");
			}
		} else {
			e.target.setCustomValidity("Trường này không được để trống");
		}

	}

	render() {
		// const { description, imageFile } = this.state;
		return (
            <div className="col-md-6 offset-md-3">
				<NotificationContainer />
                <div className="card">
                    <div className="card-heade title text-center mt-3">CẬP NHẬT THÔNG TIN</div>
                    <div className="card-body">
						{
							this.state.message ?
							(
							<div class="alert alert-danger mb-2 text-center" role="alert" id="msg">
								{this.state.message}
							</div>
							) : ''
						}

			            <form onSubmit={this.onSubmit} encType="multipart/form-data">

							<div className="form-group">
								<input type="text" className="form-control" id="firstname" name="firstname" placeholder="Nhập tên của bạn" value={this.state.firstname} onChange={this.onChange} onInvalid={this.onInvalid} required/>
						   	</div>
						   	<div className="form-group">
								<input type="text" className="form-control" id="lastname" name="lastname" placeholder="Nhập họ của bạn" value={this.state.lastname} onChange={this.onChange} onInvalid={this.onInvalid} required/>
						   	</div>

							<div className="form-group">
								<input type="email" className="form-control" id="email" name="email" placeholder="Nhập email" value={this.state.email} onChange={this.onChange} onInvalid={this.onInvalid} required/>
							</div>

                            <div className="form-group">
                               <input type="password" className="form-control" id="oldPassword" name="oldPassword" placeholder="Mật khẩu cũ" onChange={this.onChange} onInvalid={this.onInvalid} />
                           </div>

	                        <div className="form-group">
	                            <input type="password" className="form-control" id="newPassword" name="newPassword" placeholder="Mật khẩu mới" onChange={this.onChange} onInvalid={this.onInvalid} />
	                        </div>

							<div className="form-group">
								<input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Nhập lại mật khẩu mới" onChange={this.onChange} onInvalid={this.onInvalid} />
							</div>

                            <div className="form-group">
								<div className="form-row">
									<button type="submit" className="btn btn-primary mr-1 col-sm max-width">Cập nhật</button>
									<Link to={'/'} className="btn btn-danger ml-1 col-sm max-width">Quay lại</Link>
								</div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    };

}

export default EditUser
