import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
const Service = new Services();

class FoodList extends React.Component{
    constructor() {
        super();
        this.state  = {
            foodList : [],
        }

    }
    componentWillMount(){

    }

    componentDidMount(){
        console.log(Service.getServerHostName());
        axios.get(Service.getServerHostName() + "/api/food-pending")
        .then(res => {
            console.log(res.data);
            this.setState({foodList : res.data.foods})
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        const {foodList} = this.state;
        return(
            <div className="col-md-12">
                <table class="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success">
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Nhà hàng</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Đường dẫn</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        foodList.map((food,index) =>
                        <tr key={index} className='pending-table'>
                            <th scope="row">{index + 1}</th>
                            <td>{food.name}</td>
                            <td>{food.restaurant_name}</td>
                            <td>{food.cate_name}</td>
                            <td>
                                <a href={'/food-info/' + food.id}>Xem bài viết</a>
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

export default FoodList;
