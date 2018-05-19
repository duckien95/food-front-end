import React from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import Search from "./SearchFood"
import Services from "./service/Service"
import AuthService from "./authenticate/AuthService"
const Service = new Services();
const Auth = new AuthService();

class Navbar extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            login : false,
            numberPending: 0,
            user: [],
            cate: []
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(e){
        Auth.logout();
        this.setState({ login : false, user : []})
        localStorage.removeItem('search');
        localStorage.removeItem('distance');
        // window.location.reload();
        window.location.replace("/");
    }


    componentDidMount(){
        // console.log(JSON.parse(localStorage.getItem('user')));
        if(Auth.loggedIn()){
            this.setState({ login : true, user :JSON.parse(localStorage.getItem('user'))})
        }
        // if(Auth.loggedIn()  && this.state.user.type === "admin"){
        //     window.location.redirect('/admin/foods');
        // }
        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            this.setState({ cate : res.data.data })
        })

        axios.get(Service.getServerHostName() + "/api/food-pending")
        .then(res => {
            var len = res.data.foods.length;
            if(len > 0)
            this.setState({ numberPending : len })
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
                            {  Auth.loggedIn()  && this.state.user.type === "admin" ? (
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item active">
                                        <Link to={'/'} className="nav-link">Quản lý</Link>
                                    </li >
                                    <li className="nav-item">
                                        <Link to={'/admin/foods'} className="nav-link">Món ăn</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/admin/users'} className="nav-link">User</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/admin/restaurants'} className="nav-link">Nhà hàng</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/admin/pending'} className="nav-link">
                                            Chờ duyệt
                                            <span class="badge badge-light mx-1">{this.state.numberPending > 0 ? this.state.numberPending : ''}</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/food/list'} className="nav-link">Website</Link>
                                    </li>
                                </ul>
                            ) : (
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
                            ) }


                                { Auth.loggedIn()  ?
                                    (
                                        <ul className="navbar-nav">
                                        <li className="nav-item active">
                                            <span className="nav-link">
                                                {this.state.user.provider === "local" ? this.state.user.username : (this.state.user.first_name + ' ' + this.state.user.last_name)}

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
                                                    {
                                                        this.state.user.type !== "normal" ? <a href='/admin/pending' className="dropdown-item" >Duyệt bài</a> : ''
                                                    }
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
                    {  Auth.loggedIn()  && this.state.user.type === "admin" ? '' : <Search /> }

                </div>

            </div>
        )
    }
}


export default Navbar;
