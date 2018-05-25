import React from 'react'
import axios from "axios"
import { Link } from 'react-router-dom'
import Services from "../service/Service.js"
const Service = new Services();

class ListFood extends React.Component{
    constructor() {
        super();
        this.state  = {
            foods : [],
            district: [],
            cate: [],
            districtSelected: -1,
            category: -1,
            content: '',
            status: 'approve'
        }
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
        this.handleCateChange = this.handleCateChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount(){

        axios.get(Service.getServerHostName() + "/api/admin/food-pending")
        .then(res => {
            // console.log(res.data);
            this.setState({foods : res.data.foods})
        }).catch(err => {
            console.log(err);
        })

        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            this.setState({ cate : res.data.data })
        })

        axios.get(Service.getServerHostName() + '/api/district/list').then(res => {
            // console.log(res.data.data[1]);
            this.setState({ district: res.data.data[1] });
        });


    }

    handleDistrictChange(e){
        var districtID =  e.target.value
        this.setState({districtSelected : districtID});
    }

    handleCateChange(e) {
        // var cate_id = e.target.value;
        this.setState({ category : e.target.value });

    }

    onChange (e){
        const state = this.state;
        state[e.target.name] = e.target.value;
        e.target.setCustomValidity('');
        this.setState(state);
    }

    onSearch(e){
        e.preventDefault();

        const { districtSelected, category, content, status } = this.state;
        var data = { districtSelected, category, content, status};
        axios.post(Service.getServerHostName() + '/api/admin/food-search', data)
        .then(res => {
            // console.log(res);
            if(res.status === 200){
                // localStorage.setItem('search', JSON.stringify(res.data.data));
                console.log(res.data);
                this.setState({
                    foods : res.data.foods
                });

                if(content.length){
                    this.setState({
                        category: -1,
                        districtSelected: -1
                    })
                }

            }
        })

    }

    render(){
        var { districtSelected, category, foods } = this.state;
        return(
            <div className="">
            <div className="">
                <div className="text-center" id="msg">{this.state.msg}</div>
                <form onSubmit={this.onSearch} className="search-form">

                </form>

            </div>
                <table className="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success admin">
                            <th className="" scope="col">STT</th>
                            <th className="" scope="col">Tên</th>
                            <th className="" scope="col">Nhà Hàng</th>
                            <th className="" scope="col">Đường</th>
                            <th className="" scope="col">Quận</th>
                            <th className="" scope="col">Thành phố</th>
                            <th className="" scope="col">Đăng bởi</th>
                            <th className="" scope="col">Trạng thái</th>
                            <th className="" scope="col">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        foods.map((food,index) =>
                        <tr key={index} className='admin'>
                            <th className="text-center" scope="row">{index + 1}</th>
                            <td className="food_name"><a href={'/food-info/' +  food.id }>{food.name}</a></td>
                            <td className="food_restaurant">{food.restaurant_name}</td>
                            <td className="food_street">{food.street_number + ', ' + food.street_name}</td>
                            <td className="food_district">{food.district_name}</td>
                            <td className="food_city">{food.city_name}</td>
                            <td className="food_owner">{food.owner_name}</td>

                            <td className="food_status">
                                {
                                    food.status === 'approve' ? (<span className="text-success">Đã duyệt</span>) : (<span className="text-danger">Chờ duyệt</span>)
                                }
                            </td>

                            <td className="text-center">
                                <a href={'/food/edit/' + food.id} className="btn btn-primary a-admin-page"><i className="fa fa-edit"></i></a>
                                <a href={'/food-info/' + food.id} className="btn btn-info a-admin-page mx-2"><i className="far fa-file-code"></i></a>
                                <button className="btn btn-danger"><i className="far fa-trash-alt"></i></button>
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

export default ListFood;
