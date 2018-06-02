import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import Services from './service/Service'
const Service = new Services();

class Footer extends React.Component {
    constructor() {
        super();
        this.state = {
            cate: [],
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick(e){
        console.log(e.target.value);
    }

    componentDidMount(){

        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            this.setState({ cate : res.data.data })
        })

    }

    render(){
        return(
            <div>
            <footer className="main-color mx-auto">
                <div className="row row-footer">

                    <div className="col-sm col-xs-12">
                        <ul className="menu">
                            <span>Menu</span>
                            <li>
                               <Link to={'/'}>Trang chủ</Link>
                            </li>
                            <li>
                               <Link to={'/'}>Trang chủ</Link>
                            </li>
                            <li>
                               <Link to={'/'}>Trang chủ</Link>
                            </li>

                        </ul>
                    </div>

                    <div className="col-sm col-xs-12">
                        <ul className="menu">
                            <span className="logo">Ẩm thực Việt Nam</span>
                            {
                                this.state.cate.map((cate, index) =>
                                    <li key={index}>
                                        <a href={'/food-category/' + cate.cate_id } className="no-padding" >{cate.cate_name}</a>
                                    </li>

                                )
                            }
                        </ul>
                    </div>

                    <div className="col-sm col-xs-12">
                        <ul className="address">
                            <span>Liên hệ</span>
                            <li>
                              <i className="fa fa-phone" aria-hidden="true"></i> <a href="">Điện thoại : 0123 456 789</a>
                            </li>
                            <li>
                              <i className="fa fa-map-marker" aria-hidden="true"></i> <a href="">Địa chỉ : Tòa nhà A1, Minh Khai, Hà Nội</a>
                            </li>
                            <li>
                              <i className="fa fa-envelope" aria-hidden="true"></i> <a href="">Email : vietfood@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
            </div>


        )
    }
}

export default Footer
