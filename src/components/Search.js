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
            district: [],
            street: [],
            cate: [],
            cateDetail: [],
            foodList:[],
            login : false,
            user: [],
            latitude: '',
            longitude: '',
            msg: '',
            distance:[]
        }

        this.handleCateChange = this.handleCateChange.bind(this);
        this.handleDetailChange = this.handleDetailChange.bind(this);
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
		this.handleStreetChange = this.handleStreetChange.bind(this);
        this.handleDistanceChange = this.handleDistanceChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getMyLocation = this.getMyLocation.bind(this);
        this.onSearch = this.onSearch.bind(this)
    }


    componentWillMount(){
        this.getMyLocation();
        this.setState({ distance: Service.getListDistance() })
    }

    componentDidMount(){
        console.log(this.props);
        $('#link-to-search')[0].style.visibility = "hidden";

        axios.get(Service.getServerHostName() + "/api/category")
        .then(res => {
            this.setState({ cate : res.data.data })
        })

        axios.get(Service.getServerHostName() + '/api/district/list').then(res => {
            // console.log(res.data.data[1]);
			this.setState({ district: res.data.data[1] });
		});

        // console.log('latitude : ' + this.state.latitude);
    }

    onSearch(e){

        this.setState({
            category: -1,
            detail: -1,
            districtSelected: -1,
            streetSelected: -1,
            distanceSelected: -1,
            content: '',
        });

        e.preventDefault();
        localStorage.removeItem('distance');

        const { districtSelected, streetSelected, distanceSelected, category, detail, content, latitude, longitude } = this.state;
        var data = { districtSelected, streetSelected, distanceSelected,  category, detail, content, latitude, longitude };
        axios.post(Service.getServerHostName() + '/api/food-search', data)
        .then(res => {
            console.log(res);
            if(res.status === 200){
                // localStorage.setItem('search', JSON.stringify(res.data.data));
                console.log(res.data.data);
                this.setState({
                    foodList : res.data.data
                });
                localStorage.setItem('distance', this.state.distanceSelected);

                if(window.location.pathname !== "/search"){
                    $('#link-to-search')[0].click();
                }

                else {
                    console.log("in search page");
                    localStorage.removeItem('search');
                    localStorage.setItem('search', JSON.stringify(res.data.data));
                    window.location.reload();
                }

                console.log("pathname = " + window.location.pathname);


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

    handleDistrictChange(evt){
        var districtID =  evt.target.value
        console.log("district_id = " + districtID);
        if(districtID < 0){
            this.setState({street :[]});
            return;
        }

        this.setState({districtSelected : districtID});
        axios.get(Service.getServerHostName() + "/api/street/list").then(res => {
            // console.log(res.data.streetList);
            var data = res.data.data[1][districtID];
            if (Object.keys(data).length) {
                this.setState({ street: data});
                return;
            }
            this.setState({street :[]});
        })
    }

    handleStreetChange(evt){
        var street_id = evt.target.value;
        this.setState({streetSelected: street_id});
    }

    handleCateChange(e) {
        var cate_id = e.target.value;
        if(cate_id < 0){
            this.setState({ cateDetail : []});
            return;
        }

        this.setState({ category : cate_id });
        axios.get(Service.getServerHostName() + "/api/category/detail").then(res => {
            // console.log(res.data.data[cate_id]);
            this.setState({cateDetail: res.data.data[cate_id]})
        });

    }

    handleDetailChange(e){
        var detail_id = e.target.value;
        // console.log(detail_id);
        this.setState({ detail : detail_id});

    }

    handleDistanceChange(e){
        this.setState({ distanceSelected : e.target.value});
    }

    render() {
        return (
            <div className="main-color">
            <div className="container">
                <div className="text-center" id="msg">{this.state.msg}</div>
                <form onSubmit={this.onSearch} className="search-form main-color">
					<div className="form-row">
                        <div className="col-sm mb-1">
                            <select className="custom-select" name="district" onChange={this.handleDistrictChange} onInvalid={this.onInvalid}>
                                <option value="-1" selected>Quận/Huyện</option>
                                {
                                    this.state.district.map((dist, index) =>
                                        <option key={index} value={dist.district_id}>
                                            {dist.district_name}
                                        </option>
                                    )
                                }
                            </select>
                        </div>

                        <div className="col-sm mb-1">
                            <select className="custom-select" name="street" onChange={this.handleStreetChange} >
                                <option value="-1" selected>Đường/Phố</option>
                                {
                                    this.state.street.map((str, index) =>
                                        <option key={index} value={str.street_id}>
                                            {str.street_name}
                                        </option>
                                    )
                                }
                            </select>
                        </div>

						<div className="col-sm mb-1">
							<select className="custom-select" name="category" onChange={this.handleCateChange} >
							<option value="-1" selected>Loại</option>
							{
								this.state.cate.map((cat, index) =>
									<option key={index} value={cat.cate_id}>
										{cat.cate_name}
									</option>
								)
							}
							</select>
					  	</div>

					  	<div className="col-sm mb-1">
							<select className="custom-select" name="detail" onChange={this.handleDetailChange} >
								<option value="-1" selected>Chi tiết</option>
								{
									this.state.cateDetail.map((ctd, index) =>
						            	<option key={index} value={ctd.detail_id}>
						                	{ctd.detail_name}
						              	</option>
						            )
								}
							</select>
					  	</div>
                        <div className="col-sm mb-1">
                            <select className="custom-select" name="distance" onChange={this.handleDistanceChange} >
                                <option value="-1" selected>Khoảng cách</option>
                                {
                                    this.state.distance.map((dist, index) =>
                                        <option key={index} value={dist.value}>
                                            Dưới {dist.name}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-sm mb-1">
                            <input className="search" name="content" onChange={this.onChange} placeholder="Tìm theo món hoặc địa điểm" aria-label="Search" />
                        </div>
                        <div className="col-sm mb-1">
                            <button className="search" type="submit">Tìm kiếm</button>
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
