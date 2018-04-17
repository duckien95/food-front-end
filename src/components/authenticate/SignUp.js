import React from 'react';
import AuthService from './AuthService';
import $ from "jquery";
class Food extends React.Component {

	constructor(props) {
		super(props);
		this.localhost = "http://localhost:8000";
		this.state = {
            username: '',
            password: '',
			firstname: '',
            lastname: '',
            email: '',
            confirmPassword: '',
			message:''
        }

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onInvalid = this.onInvalid.bind(this);
        this.Auth = new AuthService();
	}

	componentDidMount(){
		$('#msg')[0].style.visibility='hidden'
	}


	onChange (e){
		const state = this.state;
		state[e.target.name] = e.target.value;
		e.target.setCustomValidity('');
		this.setState(state);
	}

	onSubmit(e) {
		e.preventDefault();
		const { username, password, confirmPassword, firstname, lastname, email} = this.state;
		if(confirmPassword !==  password){
			$('#confirmPassword')[0].setCustomValidity("Email không hợp lệ");
			console.log("email not valid");
		}



		let provider = "local";

		// let formData = new FormData();
		// formData.append('username', username);
		// formData.append('password', password);
        // formData.append('provider', 'local');
        // formData.append('firstname', firstname);
        // formData.append('lastname', lastname);
        // formData.append('email', email);
		// console.log(formData);
		// var data =JSON.stringify({ username, password, provider, email, firstname, lastname});

		this.Auth.localSignUp(username, password,  provider, email, firstname, lastname)
            .then(res =>{

				console.log("res = " + JSON.stringify(res));
				if(!res.success){
					$('#msg')[0].style.visibility='visible';
					this.setState({message: res.msg});
					this.props.history.replace('/signup');
				}
				else {
					this.props.history.replace('/');
				}


            })
            .catch(err =>{
                alert(err);
            })
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
                    <div className="card-header text-center">ĐĂNG KÝ TÀI KHOẢN</div>
                    <div className="card-body">
						<div class="alert alert-danger" role="alert" id="msg">
							{this.state.message}
						</div>
			            <form onSubmit={this.onSubmit} encType="multipart/form-data">

							<div className="form-group">
								<input type="text" className="form-control" id="firstname" name="firstname" placeholder="Nhập tên của ban" onChange={this.onChange} onInvalid={this.onInvalid} required/>
						   	</div>
						   	<div className="form-group">
								<input type="text" className="form-control" id="lastname" name="lastname" placeholder="Nhập họ của bạn" onChange={this.onChange} onInvalid={this.onInvalid} required/>
						   	</div>

							<div className="form-group">
								<input type="email" className="form-control" id="email" name="email" placeholder="Nhập email" onChange={this.onChange} onInvalid={this.onInvalid} required/>
							</div>

	                       	<div className="form-group">
	                        	<input type="text" className="form-control" id="username" name="username" placeholder="Tên đăng nhập" onChange={this.onChange} onInvalid={this.onInvalid} required/>
	                       	</div>

	                        <div className="form-group">
	                            <input type="password" className="form-control" id="password" name="password" placeholder="Mật khẩu" onChange={this.onChange} onInvalid={this.onInvalid} required/>
	                        </div>

							<div className="form-group">
								<input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Xác thực mật khẩu" onChange={this.onChange} onInvalid={this.onInvalid} required/>
							</div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-info mb-3 maxWidth">Đăng ký</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    };

}

export default Food
