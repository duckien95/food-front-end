import React from 'react'
import axios from "axios"
import { Link } from 'react-router-dom'
import Food from './FoodTemplate'
import $ from "jquery"
import Services from "../service/Service.js"
const Service = new Services();

class SearchResult extends React.Component{
    constructor(props) {
        super(props);
        this.state  = {
            totalList: [],
            foodList : [],
            msg: '',
            distanceLevel: -1,
            distance: [],
            category: [],
            cateList: [],
            maxDistance: -1,
            foodCategoryList: [],
            numberResult: ''
        }

        this.handleDistanceChange = this.handleDistanceChange.bind(this);
        this.setSearchState = this.setSearchState.bind(this);

    }

    setSearchState(){
        this.setState({
            foodList : [],
            msg : "Không tìm thấy kết quả nào"
        });
        $('#search-found')[0].style.visibility = 'hidden';
        $('.search-not-found')[0].style.visibility = 'visible';
    }

    componentDidMount(){

        $('.search-not-found')[0].style.visibility = 'hidden';

        axios.get(Service.getServerHostName() + '/api/food/category-list')
        .then(
            res => {
                this.setState({ foodCategoryList : res.data.data})
            }
        )
        // console.log(Service.getListDistance());
        var maxDistance = localStorage.getItem('distance');
        // console.log(maxDistance === undefined);
        // console.log(maxDistance !== undefined);
        this.setState({
            distance: Service.getListDistance(),
            maxDistance: maxDistance !== undefined ? maxDistance : -1
        });


        let para = this.props.location.query;
        console.log((this.props.location.query === undefined ));
        // if(window.location.path)
        if(para !== undefined ){
            console.log(para.food);
            if(para.food.length){
                this.setState({ foodList : para.food, totalList : para.food, numberResult : para.food.length })
            }
            else{
                this.setSearchState();
            }
        }
        else {
            var data =   JSON.parse(localStorage.getItem('search'));
            if(data.length){
                // let data = JSON.parse(localData);
                console.log(data);
                this.setState({ foodList : data, totalList : data, numberResult: data.length });
            }
            else {
                this.setSearchState();
            }
        }

        // $('#search-found')[0].style.visibility = this.state.msg === '' ? 'visible' :'hidden' ;




        // console.log(this.props.location.query);
    }

    handleDistanceChange(e){

        var total = this.state.totalList;
        var dist = e.target.value;

        console.log('line 92 : ' + dist);
        var temp = [];
        if(Number(dist) > 0){
            for (var i = 0; i < total.length; i++) {
                var distOfElement = total[i].distance.split(' ')[0];
                if (Number(distOfElement) <= Number(dist)){
                    temp.push(total[i]);
                }
            }
            this.setState({ foodList : temp, numberResult: temp.length, distanceLevel : dist  });
        }
        else {
            this.setState({ foodList : total, numberResult: total.length, distanceLevel : dist });
        }

    }

    render(){
        return(
            <div className="">

            <div className="text-center search-not-found alert alert-warning">{this.state.msg}</div>
            <div className="card" id="search-found">
                <div className="card-header">
                    <div className="float-left col-md-6 number-result-search text-danger">
                        {this.state.numberResult > 0 ? ('Tìm thấy ' + this.state.numberResult + ' địa điểm ') : 'Không có địa điểm nào '}
                        { Number(this.state.distanceLevel) > 0 ? (' dưới ' + this.state.distanceLevel + ' km') : ''}
                    </div>
                    <div className="float-right col-md-3 text-center">
                        <select className="custom-select" name="distance" id="distanceSelect" onChange={this.handleDistanceChange} >
                            <option value="-1" selected>Khoảng cách</option>
                            {
                                this.state.distance.map((dist, index) =>

                                    ( Number(this.state.maxDistance) < 0) ? <option key={index} value={dist.value}>Dưới {dist.name}</option>
                                    :( Number(dist.value) <= Number(this.state.maxDistance) ?
                                        (<option key={index} value={dist.value}>Dưới {dist.name}</option>)
                                        : ''
                                    )


                                )
                            }
                        </select>
                    </div>
                </div>
                <div className="card-body">
                    <Food foods={this.state.foodList} />
                </div>
            </div>
        </div>

        )
    }

}

export default SearchResult;
