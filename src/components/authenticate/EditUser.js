import React from 'react';
import AuthService from './AuthService';
import { Link } from 'react-router-dom'
import $ from "jquery";
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
        this.temp = data;
        this.setState ({
            firstname : data.first_name,
            lastname : data.last_name,
            email: data.email
        })

        console.log(data);
	}


	onChange (e){
		const state = this.state;
		state[e.target.name] = e.target.value;
		e.target.setCustomValidity('');
		this.setState(state);
	}

	onSubmit(e) {
		e.preventDefault();
		const { userId, firstname, lastname, email, oldPassword, newPassword, confirmPassword} = this.state;

        if(oldPassword){
            if(confirmPassword !==  newPassword){
                // alert('mat khau khong khop')
                this.setState({message: "Mật khẩu mới không khớp"});
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
            provider : this.temp.provider,
            username : this.temp.username,
            type : this.temp.type
        };

        this.Auth.editUser(editData)
        .then(
            res => {
                console.log(res);
                if(!res.success){
                    this.setState({ message : res.msg})
                }
                else{
                    this.props.history.push('/');
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
