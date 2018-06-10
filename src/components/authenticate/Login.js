import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import AuthService from './AuthService';
import $ from 'jquery';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            redirect: false,
            username: '',
            password: '',
            message: ''
        };

        this.signup = this.signup.bind(this);
        this.localSignup = this.localSignup.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onInvalid = this.onInvalid.bind(this);

        this.Auth = new AuthService();
    }


    componentWillMount(){
        if(this.Auth.loggedIn()){
            var user = JSON.parse(localStorage.getItem('user'));
            // console.log(user);
            if(user.type === 'admin'){
                this.props.history.replace('/admin');
            }
            else {
                this.props.history.replace('/');
            }

            // if(this)
            // console.log("logged");
        }
    }

    componentDidMount(){
        $(".kep-login-facebook").text("Đăng nhập bằng facebook");
        $('#msg')[0].style.visibility = 'hidden';
    }

    onSubmit(e){
        e.preventDefault();
        const {username, password } = this.state;
        this.Auth.localLogin(username, password)
            .then(res =>{

                $('#msg')[0].style.visibility='visible';
                console.log("res = " + JSON.stringify(res));
                if(!res.success){
                    this.setState({message: res.msg});
                    this.props.history.replace('/login');
                } else {
                    // this.props.history.replace('/');
                    window.location.reload('/')
                    window.history.back();
                }

            })
            .catch(err =>{
                console.log(err);
            })
    }

    onChange (e){
        const state = this.state;
        state[e.target.name] = e.target.value;
        e.target.setCustomValidity('');
        this.setState(state);
    }

	onInvalid(e){

		if(e.target.value === ""){
			e.target.setCustomValidity('Trường này không được để trống');
		}
		else{
			e.target.setCustomValidity('');
		}
	}

    localSignup(e){
        this.props.history.replace("/signup")
    }

    signup(res, type) {
        // console.log(res);
        var postData;
        if (type === 'facebook' && res.email) {
            // console.log('facebook login');
            postData = {
                firstname: ' ',
                lastname: res.name,
                email: res.email,
                token: res.userID,
                provider_pic: res.picture.data.url,
                provider: type
            };
            // console.log(postData);
        }

        if (type === 'google') {
            var data = res.profileObj;
            postData = {
                firstname: data.givenName,
                lastname: data.familyName,
                email: data.email,
                token: res.googleId,
                provider_pic: data.imageUrl,
                provider: type
            };
        }

        if (postData) {
            this.Auth.googleFaceLogin(postData)
                .then((result) => {
                    // console.log(result);
                    window.location.reload('/')
                    window.history.back();
                })
                .catch((err)=> {
                    console.log("error");
                });
        }
        // else {
        //     console.log("postdata null");
        // }
        // 352847025224177
    }

    render(){

        const responseFacebook = (response) => {
            // console.log("facebook console");
            // console.log(JSON.stringify(response));
            this.signup(response, 'facebook');
        }

        const responseGoogle = (response) => {
            // console.log("google console");
            // console.log(response);
            this.signup(response, 'google');
        }

        return (
            <div className="jumbotron col-md-6 offset-md-3">
                <div className="col-sm-12 mb-3">
                    <FacebookLogin
                        appId="352847025224177"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}
                        render={
                            renderProps => (
                                <button onClick={renderProps.onClick}>This is my custom FB button</button>
                            )
                        }
                    />
                </div>
                <div className="col-sm-12 mb-3">
                    <GoogleLogin
                        clientId="52426440954-iimhn8npr2o0hg0gro4qgas3ps01qk25.apps.googleusercontent.com"
                        buttonText="Đăng nhập bằng Google"
                        autoLoad={false}
                        onSuccess={responseGoogle}
                        className="login-google-button btn-danger"
                        onFailure={responseGoogle}
                    />
                </div>
                <form onSubmit ={this.onSubmit} className="col-sm-12">
                    {
                        this.state.message === '' ?
                        (<div className="alert alert-danger" id="msg" hidden >
                            {this.state.message}
                        </div>) :
                        (<div className="alert alert-danger" id="msg"  >
                            {this.state.message}
                        </div>)
                    }

                    <div className="form-group">
                        <input type="text" className="form-control" name="username" aria-describedby="emailHelp" placeholder="Tên đăng nhập" onChange={this.onChange} onInvalid={this.onInvalid} required/>
                    </div>

                    <div className="form-group">
                        <input type="password" className="form-control" name="password" placeholder="Mật khẩu" onChange={this.onChange} onInvalid={this.onInvalid} required />
                    </div>

                    <div className="form-group">
                        <div className="form-row">

                            <div className="col-md-6 mb-3">
                                <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
                            </div>

                            <div className="col-md-6 mb-3">
                                <button className="btn btn-danger w-100" onClick={this.localSignup}>Đăng ký</button>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        );

    }


}

export default Login;
