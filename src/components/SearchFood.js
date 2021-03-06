import React from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import $ from 'jquery'
import Services from "./service/Service"
const Service = new Services();

class Search extends React.Component{
    constructor() {
        super();
        this.state= {
            category: -1,
            detail: -1,
            districtSelected: -1,
            streetSelected: -1,
            distanceSelected: -1,
            content: '',
            max_price: '',
            min_price: '',
            district: [],
            street: [],
            cate: [],
            cateDetail: [],
            list_max_price: [],
            main_list_max: [],
            list_min_price: [],
            foodList:[],
            login : false,
            user: [],
            latitude: '',
            longitude: '',
            msg: '',
            distance:[]
        }

        this.handleCateChange = this.handleCateChange.bind(this);
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
		this.handleStreetChange = this.handleStreetChange.bind(this);
        this.handleDistanceChange = this.handleDistanceChange.bind(this)
        this.handleMinPrice =  this.handleMinPrice.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getMyLocation = this.getMyLocation.bind(this);
        this.onSearch = this.onSearch.bind(this)
    }

    componentDidMount(){
        this.getMyLocation();
        // console.log("URL : " + window.location.pathname);
        this.setState({ distance: Service.getListDistance() });
        var localSeach = localStorage.getItem('search-info');
        console.log(localSeach);
        console.log(window.location.pathname);
        if(window.location.pathname !== "/search"){
            console.log('path name != search');
            // alert('path name != search');
            localStorage.removeItem('search-info');
            var data = {
                districtSelected : -1,
                distanceSelected : -1,
                category: -1,
                min_price : -1,
                max_price : -1
            }
            localStorage.setItem('search-info',
                JSON.stringify(data)
            );
            this.setState(data)
        }
        else {
            if(localSeach !== null){
                console.log('searchInfo not null');
                // alert('searchInfo not null');
                var searchInfo = JSON.parse(localSeach);
                // console.log(searchInfo);
                this.setState({
                    category: searchInfo.category,
                    detail: searchInfo.detail,
                    districtSelected: searchInfo.districtSelected,
                    streetSelected: searchInfo.streetSelected,
                    distanceSelected: searchInfo.distanceSelected,
                    min_price: searchInfo.min_price,
                    max_price: searchInfo.max_price
                })

            }
        }

        // console.log(this.props);

        $('#link-to-search')[0].style.visibility = "hidden";

        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            this.setState({ cate : res.data.data })
        })

        axios.get(Service.getServerHostName() + '/api/district/list').then(res => {
            // console.log(res.data.data[1]);
			this.setState({ district: res.data.data[1] });
		});

        axios.get(Service.getServerHostName() + '/api/food-min-price')
        .then(
            res => {
                this.setState({ list_min_price : res.data.prices })
            }
        )

        axios.get(Service.getServerHostName() + '/api/food-max-price')
        .then(
            res => {
                this.setState({ list_max_price : res.data.prices, main_list_max: res.data.prices })
            }
        )

        // console.log(this.state.districtSelected);


        // console.log('latitude : ' + this.state.latitude);
    }

    onSearch(e){
        e.preventDefault();
        localStorage.removeItem('distance');
        localStorage.removeItem('search-info');

        var { content, latitude, longitude, districtSelected, category, distanceSelected, min_price, max_price } = this.state;
        var streetSelected = -1, detail = -1;
        // var districtSelected = this.state.districtSelected;
        // var streetSelected = (this.state.streetSelected ? this.state.streetSelected : -1);
        // var distanceSelected = this.state.distanceSelected ;
        // var detail = (this.state.detail ? this.state.detail : -1);
        // var category = (this.state.category ? this.state.category : -1);
        // alert(category);
        if(!content.length){
            localStorage.setItem('search-info',
                JSON.stringify({
                    districtSelected : districtSelected,
                    streetSelected: -1,
                    distanceSelected : distanceSelected,
                    category : category,
                    detail : -1,
                    min_price: min_price,
                    max_price: max_price
                })
            );
        }
        max_price = Number(max_price);
        var data = { districtSelected, streetSelected, distanceSelected,  category, detail, content, min_price, max_price, latitude, longitude };
        axios.post(Service.getServerHostName() + '/api/food-search', data)
        .then(res => {
            // console.log(res);
            if(res.status === 200){
                // localStorage.setItem('search', JSON.stringify(res.data.data));
                console.log(res.data);
                this.setState({
                    foodList : res.data.foods
                });

                localStorage.setItem('distance', distanceSelected);
                localStorage.setItem('search', JSON.stringify(res.data.foods));

                if(content.length){
                    this.setState({
                        category: -1,
                        districtSelected: -1,
                        distanceSelected: -1
                    })
                }

                if(window.location.pathname !== "/search"){
                    $('#link-to-search')[0].click();
                }
                else {
                    window.location.reload();
                }
                //
                // console.log("pathname = " + window.location.pathname);


            }
        })

    }

    onChange (e){
        const state = this.state;
        state[e.target.name] = e.target.value;
        e.target.setCustomValidity('');
        this.setState(state);
    }

    getMyLocation() {
      const location = window.navigator && window.navigator.geolocation
      if (location) {


        location.getCurrentPosition((position) => {
            // console.log(position.coords);
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        }, (error) => {
          this.setState({ latitude: '20.971581999999998', longitude: '105.83916219999999' })
        })
      }

    }

    handleMinPrice(e) {
        var min_price = Number(e.target.value),
            list_max = this.state.main_list_max,
            new_list_max = [];
        console.log(list_max.length);
        for (let i = 0; i < list_max.length; i++) {
            if(Number(list_max[i].max_price) > min_price){
                new_list_max.push(list_max[i]);
            }
        }

        this.setState( { min_price: min_price, list_max_price: new_list_max });
        axios.get(Service.getServerHostName() + '/api/food-max-price')
        .then(
            res => {
                this.setState({ main_list_max: res.data.prices })
            }
        )
        // console.log(this.state.main_list_max);
    }

    handleDistrictChange(e){
        var districtID =  e.target.value
        // console.log("district_id = " + districtID);
        this.setState({districtSelected : districtID});

        // if(districtID < 0){
        //     this.setState({street :[]});
        //     return;
        // }

        // axios.get(Service.getServerHostName() + "/api/street/list").then(res => {
        //     // console.log(res.data.streetList);
        //     var data = res.data.data[1][districtID];
        //     if (Object.keys(data).length) {
        //         this.setState({ street: data});
        //         return;
        //     }
        //     this.setState({street :[]});
        // })
    }

    handleStreetChange(evt){
        var street_id = evt.target.value;
        this.setState({streetSelected: street_id});
    }

    handleCateChange(e) {
        // var cate_id = e.target.value;
        this.setState({ category : e.target.value });

    }



    handleDistanceChange(e){
        console.log('handleDistanceChange');
        this.setState({ distanceSelected : e.target.value});
    }

    render() {
        var { districtSelected, distanceSelected, category, detail } = this.state;
        return (
            <div className="main-color">
            <div className="container px-1">
                <div className="text-center" id="msg">{this.state.msg}</div>
                <form onSubmit={this.onSearch} className="search-form main-color">
					<div className="form-row">
                        <div className="col-sm mb-1">
                            <select className="custom-select" name="district" onChange={this.handleDistrictChange} onInvalid={this.onInvalid}>
                                <option value="-1" selected>Quận/Huyện</option>
                                {
                                    this.state.district.map((dist, index) =>
                                        Number(districtSelected) === dist.district_id ?
                                        (<option key={index} value={dist.district_id} selected>{dist.district_name}</option>)
                                        : (<option key={index} value={dist.district_id}>{dist.district_name}</option>)
                                    )
                                }
                            </select>
                        </div>


						<div className="col-sm mb-1">
							<select className="custom-select" name="category" onChange={this.handleCateChange} >
							<option value="-1" selected>Loại món ăn</option>
							{
								this.state.cate.map((cat, index) =>
                                    Number(category) == cat.cate_id ?
									(<option key={index} value={cat.cate_id} selected>{cat.cate_name}</option>)
                                    : (<option key={index} value={cat.cate_id}>{cat.cate_name}</option>)
								)
							}
							</select>
					  	</div>

                        <div className="col-sm mb-1">
                            <select className="custom-select" name="distance" onChange={this.handleDistanceChange} >
                                <option value="-1" selected>Khoảng cách</option>
                                {
                                    this.state.distance.map((dist, index) =>
                                        Number(distanceSelected) == dist.value ?
                                        (<option key={index} value={dist.value} selected> Dưới {dist.name}</option>)
                                        :(<option key={index} value={dist.value}> Dưới {dist.name}</option>)
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-sm mb-1">
                            <select className="custom-select" name="min_price" onChange={this.handleMinPrice} >
                                <option value="-1" selected>Giá tối thiểu</option>
                                {
                                    this.state.list_min_price.map((price, index) =>
                                        Number(this.state.min_price) === Number(price.min_price) ?
                                            (<option key={index} value={price.min_price} selected>Trên {Service.formatMoney(`${price.min_price}`)} VND</option>)
                                            : (<option key={index} value={price.min_price}>Trên {Service.formatMoney(`${price.min_price}`)} VND</option>)
                                    )
                                }
                            </select>
                        </div>

                        <div className="col-sm mb-1">
                            <select className="custom-select" name="max_price" onChange={this.onChange} >
                                <option value="-1" selected>Giá tối đa</option>
                                {
                                    this.state.list_max_price.map((price, index) =>
                                        Number(this.state.max_price) === Number(price.max_price) ?
                                            (<option key={index} value={price.max_price} selected>Dưới {Service.formatMoney(`${price.max_price}`)} VND</option>)
                                            : (<option key={index} value={price.max_price}>Dưới {Service.formatMoney(`${price.max_price}`)} VND</option>)

                                    )
                                }
                            </select>
                        </div>

                        <div className="col-sm mb-1">
                            <input className="search" name="content" onChange={this.onChange} placeholder="Nhập tên món ăn" aria-label="Search" />
                        </div>
                        <div className="col-sm mb-1">
                            <button className="search btn-info" type="submit">Tìm kiếm</button>
                        </div>

                        <Link to={{  pathname: '/search', query: { food: this.state.foodList }}}  id="link-to-search"/>
    			    </div>
                </form>

			</div>
            </div>
        )
    }
}


export default Search;
