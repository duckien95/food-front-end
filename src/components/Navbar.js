import React from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import SearchFood from "./SearchFood"
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

                    {  Auth.loggedIn()  && this.state.user.type === "admin" ? (
                        <div  className="container-fluid">
                            <ul className="navbar-nav mr-auto">


                                <li className="nav-item">
                                    <a href='/admin' className="nav-link">QUẢN LÝ HỆ THỐNG</a>
                                </li >

                                <li className="nav-item">
                                    <a href='/food/list' className="nav-link"></a>
                                </li>


                            </ul>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <span className="nav-link">
                                        {this.state.user.provider === "local" ? this.state.user.username : (this.state.user.first_name + ' ' + this.state.user.last_name)}

                                    </span>

                                </li>
                                <li className="nav-item">
                                    <Link to={'/'} className="nav-link" onClick={this.handleLogout}></Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-cog"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                            <a href={'/food/create'} className="dropdown-item">Thêm món ăn</a>
                                            <a href={'/food-favorite/' + this.state.user.id } className="dropdown-item" >Món ăn đã lưu lại</a>
                                            <a href={'/food-like/' + this.state.user.id } className="dropdown-item" >Món ăn đã thích</a>
                                            <a href={'/food-post/' + this.state.user.id } className="dropdown-item" >Món ăn đã đăng</a>
                                            <a href={'/edit/' + this.state.user.id } className="dropdown-item" >Chỉnh sửa thông tin</a>
                                            <a className="dropdown-item" onClick={this.handleLogout} >Đăng xuất</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ) :
                    ( Auth.loggedIn()  && this.state.user.type === "normal" ? (
                        <div className="container px-1">

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <Link to={'/'} className="nav-link">Trang chủ</Link>
                                    </li >

                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Thể  loại
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
                                <ul className="navbar-nav">
                                <li className="nav-item">
                                    <span className="nav-link">
                                        {this.state.user.provider === "local" ? this.state.user.username : (this.state.user.first_name + ' ' + this.state.user.last_name)}

                                    </span>

                                </li>
                                <li className="nav-item">
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
                                            <a href={'/food/create'} className="dropdown-item" >Thêm món ăn</a>
                                            <a href={'/food-favorite/' + this.state.user.id } className="dropdown-item" >Món ăn đã lưu lại</a>
                                            <a href={'/food-like/' + this.state.user.id } className="dropdown-item" >Món ăn đã thích</a>
                                            <a href={'/food-post/' + this.state.user.id } className="dropdown-item" >Món ăn đã đăng</a>
                                            <a href={'/edit/' + this.state.user.id } className="dropdown-item" >Chỉnh sửa thông tin</a>
                                            <a className="dropdown-item" onClick={this.handleLogout} >Đăng xuất</a>
                                    </div>
                                </li>

                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="container px-1">

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <Link to={'/'} className="nav-link">Trang chủ</Link>
                                    </li >

                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Loại món ăn
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
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link to={'/login'} className="nav-link">Đăng nhập</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))
                    }

                    </nav>
                    {  Auth.loggedIn()  && this.state.user.type === "admin" ? '' : <SearchFood /> }
                </div>

            </div>
        )
    }
}


export default Navbar;
