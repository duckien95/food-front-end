import React from 'react'
import {Link} from 'react-router-dom'
import axios from "axios"
import Search from "./Search"
import Services from "./service/Service"
import AuthService from "./authenticate/AuthService"
const Service = new Services();
const Auth = new AuthService();

class Navbar extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            login : false,
            user: [],
            cate: []
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.setUserState =  this.setUserState.bind(this);
    }

    setUserState(data) {
        this.setState({ user : data });
        console.log('set user state');
        console.log(data);
    }

    handleLogout(e){
        Auth.logout();
        this.setState({ login : false, user : []})
        localStorage.removeItem('search');
        localStorage.removeItem('distance');
        // window.location.reload();
        window.location.replace("http://localhost:3000");
    }


    componentDidMount(){
        // console.log(this.state.user);
        if(Auth.loggedIn()){
            this.setState({ login : true, user :JSON.parse(localStorage.getItem('user'))})
        }

        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            this.setState({ cate : res.data.data })
        })

        // console.log('line 40');
        // console.log(Auth.loggedIn());
        // console.log(JSON.parse(localStorage.getItem('user')));
        // console.log('provider' + this.state.user.provider);
    }

    render() {
        return (
            <div className="row row-offcanvas row-offcanvas-right">

                <div className="fixed-top">

                    <nav className="navbar navbar-expand-lg navbar-light main-color">
                    <div className="container">

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link to={'/'} className="nav-link">VIETFOOD</Link>
                                </li >

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Thực đơn
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {
                                        this.state.cate.map((cate, index) =>
                                            <a key={index} href={'/food-category/' + cate.cate_id } className="dropdown-item" >{cate.cate_name}</a>

                                        )
                                    }
                                    </div>
                                </li>
                            </ul>

                                { Auth.loggedIn()  ?
                                    (
                                        <ul className="navbar-nav">
                                        <li className="nav-item active">
                                            <span className="nav-link">
                                                {this.state.user.provider === "local" ? this.state.user.username : (this.state.user.firstName + ' ' + this.state.user.lastName)}

                                            </span>

                                        </li>
                                        <li className="nav-item active">
                                            <Link to={'/'} className="nav-link" onClick={this.handleLogout}></Link>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fa fa-cog"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                                    <a href={'/food/create'} className="dropdown-item" >Đăng bài</a>
                                                    <a href={'/food-favorite/' + this.state.user.id } className="dropdown-item" >Bài viết đã lưu lại</a>
                                                    <a href={'/food-like/' + this.state.user.id } className="dropdown-item" >Bài viết đã thích</a>
                                                    <a href={'/food-post/' + this.state.user.id } className="dropdown-item" >Bài viết đã đăng</a>
                                                    <a href={'/edit/' + this.state.user.id } className="dropdown-item" >Chỉnh sửa thông tin</a>
                                                    <a className="dropdown-item" onClick={this.handleLogout} >Đăng xuất</a>
                                            </div>
                                        </li>

                                        </ul>
                                    )
                                    : (
                                        <ul className="navbar-nav">
                                            <li className="nav-item">
                                                <Link to={'/login'} className="nav-link">Đăng nhập</Link>
                                            </li>
                                        </ul>
                                    )
                                }


                        </div>
                        </div>
                    </nav>
                    <Search />
                </div>

            </div>
        )
    }
}


export default Navbar;
