import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
// import {PostData} from '../services/PostData';
import {Redirect} from 'react-router-dom';
import AuthService from './AuthService';

class Wellcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            redirect: false,
        };
        this.signup = this.signup.bind(this);
        this.Auth = new AuthService();
    }

    componentWillMount(){
        if(this.Auth.loggedIn()){
            this.props.history.replace('/');
            console.log("logged");
        }
    }

    signup(res, type) {
        console.log(res);
        var postData;
        if (type === 'facebook' && res.email) {
            postData = {
                name: res.name,
                provider: type,
                email: res.email,
                provider_id: res.id,
                token: res.accessToken,
                provider_pic: res.picture.data.url
            };
        }

        if (type === 'google') {
            var data = res.profileObj;
            postData = {
                firstName: data.givenName,
                lastName: data.familyName,
                email: data.email,
                token: res.tokenObj.access_token,
                provider_pic: data.imageUrl,
                provider: type
            };
        }

        if (postData) {
            this.Auth.login(postData)
                .then((result) => {
                    console.log("wellcome js,result = " + result);
                    this.props.history.replace('/');
                    // sessionStorage.setItem("userData", JSON.stringify(responseJson));
                    // this.setState({redirect: true});
                })
                .catch((err)=> {
                    console.log("error");
                    alert(err);
                });
        } else {
            console.log("postdata not null");
        }
    }

  render() {

    // if (this.state.redirect || sessionStorage.getItem('userData')) {
    //   return (<Redirect to={'/home'}/>)
    // }

    const responseFacebook = (response) => {
      console.log("facebook console");
      console.log(JSON.stringify(response));
      this.signup(response, 'facebook');
    }

    const responseGoogle = (response) => {
      console.log("google console");
      // console.log(response);
      this.signup(response, 'google');
    }

    return (

      <div className="form-group row">
      <div className="form-row">
      <div className="col-sm-6 mb-3">
            <FacebookLogin
              appId="352847025224177"
              autoLoad={false}
              className="btn btn-primary"
              fields="name,email,picture"
              callback={responseFacebook}/>
            <br/><br/>
        </div>

        <div className="col-sm-6 mb-3">

            <GoogleLogin
              clientId="52426440954-iimhn8npr2o0hg0gro4qgas3ps01qk25.apps.googleusercontent.com"
              buttonText="Login with Google"
              className="btn btn-danger"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}/>
        </div>
        </div>
      </div>
    );
  }
}

export default Wellcome;
