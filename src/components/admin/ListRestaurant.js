import React from 'react'
import axios from "axios"
import Services from "../service/Service.js"
const Service = new Services();

class ListRestaurant extends React.Component{
    constructor() {
        super();
        this.state  = {
            restaurants : [],
        }

    }

    componentDidMount(){
        this.setState({ restaurants : [] });
        axios.get(Service.getServerHostName() + "/api/restaurant-list")
        .then(res => {
            // console.log(res.data.data.length);
            this.setState({restaurants : res.data.data})
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        const { restaurants } = this.state;
        return(
            <div className="col-md-12">
                <table class="table table-bordered table-light table-hover">
                    <thead>
                        <tr className="table-success admin">
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Địa điểm & Món</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        restaurants.map((rest,index) =>
                        <tr key={index} className=''>
                            <th scope="row">{index + 1}</th>
                            <td>{rest.restaurant_name}</td>

                            <td>

                            {
                                rest.foods.map( (fod, index) =>
                                    <ul className="list-unstyle" key={index}>{fod.address}
                                    {
                                        fod.food_in_address.map( (food, index) =>
                                            <li key={index}>
                                                <a href={'/food-info/' + food.food_id}>{food.food_name}</a>
                                            </li>
                                        )
                                    }
                                    </ul>
                                )
                            }

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

export default ListRestaurant;
