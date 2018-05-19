import React from 'react';
import Services from "../service/Service.js"
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from 'axios'
const Service = new Services();
class FoodEdit extends React.Component {

	constructor(props) {
		super(props);
		this.user = JSON.parse(localStorage.getItem('user'));
        this.food = [];
		this.state = {
			name: '',
			description: '',
			price : '',
			restaurant : '',
			category: '',
			detail: 0,
			citySelected: '',
			districtSelected: '',
			streetSelected: '',
			addressDetail: '',
			uploadFile: [],
			imageFile:[],
			videoFile:[],
			city:[],
	        district:[],
	        street:[],
			cate: [],
			cateDetail: [],
			listImageName: 'Chọn ảnh',
			listVideoName: 'Chọn video'
		};

		this.handleCityChange = this.handleCityChange.bind(this);
		this.handleDistrictChange = this.handleDistrictChange.bind(this);
		this.handleStreetChange = this.handleStreetChange.bind(this);
		this.handleCateChange = this.handleCateChange.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onInvalid = this.onInvalid.bind(this);
	}

	componentDidMount(){
        var foodId =  this.props.match.params.foodId;

        axios.get(Service.getServerHostName() + '/api/food/' + foodId)
        .then(
            res => {
                this.food =  res.data.data;
                this.setState({
                    name: this.food.name,
                    description : this.food.description,
                    price : this.food.prices,
                    restaurant: this.food.restaurant_name,
                    addressDetail: this.food.street_number,
                    citySelected : this.food.city_id,
                    districtSelected: this.food.district_id,
                    streetSelected: this.food.street_id,
                    category: this.food.category_id
                })
            }
        ).then(
            res => {
                axios.get(Service.getServerHostName() + '/api/city/list').then(res => {
                    this.setState({ city: res.data.data });
                })
            }
        ).then(
            res => {
                axios.get(Service.getServerHostName() + "/api/category").then(res => {
                    this.setState({cate : res.data.data})
                })
            }
        ).then(
            res => {
                axios.get(Service.getServerHostName() + "/api/district/list").then(res => {
                    var city_id = this.food.city_id;
                    console.log(this.food);
                    console.log("city_id : " + city_id);
                    console.log(res.data.data);
                    this.setState({ district: res.data.data[city_id]});
                })
            }
        ).then(
            res => {
                axios.get(Service.getServerHostName() + "/api/street/list").then(res => {
                    let city_id = this.food.city_id;
                    let district_id = this.food.district_id;
                    this.setState({ street: res.data.data[city_id][district_id]});
                })
            }
        )
	}

	onChange (e){
		const state = this.state;

		switch (e.target.name) {
			case 'imageFile':

				state.imageFile = e.target.files;
				var list = e.target.files;
				var name = "";
				for(var i=0; i < list.length; i++){
					name += list[i].name + ', ';
				}
				state.listImageName = name.slice(0, -1);
				break;

			case 'videoFile':

				state.videoFile = e.target.files;
				list = e.target.files;
				name = "";
				for(i=0; i < list.length; i++){
					name += list[i].name + ', ';
				}
				state.listVideoName = name.slice(0, -1);
				break;

			default:
				state[e.target.name] = e.target.value;

		}
		e.target.setCustomValidity('');

		this.setState(state);
	}

	onSubmit(e) {

		e.preventDefault();

		const { name, description, price, category, detail, restaurant, citySelected, districtSelected, streetSelected, addressDetail, imageFile, videoFile} = this.state;

		let formData = new FormData();

		formData.append('name', name);
		formData.append('description', description);
		formData.append('price', price);
		formData.append('city', citySelected);
		formData.append('district', districtSelected);
		formData.append('street', streetSelected);
		formData.append('addressDetail', addressDetail);
		formData.append('category', category);
		formData.append('detail', detail);
		formData.append("owner_id", this.user.id);
		formData.append('restaurant', restaurant);

		for(var i=0; i < imageFile.length; i++){
			console.log(imageFile[i]);
			formData.append('uploadFile', imageFile[i]);
		}

		for(i=0; i < videoFile.length; i++){
			console.log(videoFile[i]);
			formData.append('uploadFile', videoFile[i]);
		}

		console.log(formData);

		axios.post(Service.getServerHostName() + "/food/edit/" + this.food.id, formData)
		.then((result) => {
				console.log(result);
				if(result.data.status === 'success'){

					this.props.history.replace("/food-info/" + this.food.id);
					NotificationManager.success('Thành công', 'Sửa bài viết');
				}
				else {
					NotificationManager.error('', 'Có lỗi xảy ra');
				}
				// access results...
			})
	}

	onInvalid(e){
		console.log("value " + e.target.value );
		console.log(e.target.value === "");
		if(e.target.value === ""){
			e.target.setCustomValidity('Trường này không được để trống');
		}
		else{
			e.target.setCustomValidity('');
		}
	}

	handleCateChange(e) {
		var cate_id = e.target.value;
		console.log("change cate");
		this.setState({ category : cate_id });
	}


	handleCityChange(e){
		var city_id = e.target.value;
		console.log("city_id = " + city_id);
		this.setState({citySelected : city_id});
		axios.get(Service.getServerHostName() + "/api/district/list").then(res => {
			var data = res.data.data[city_id];
			console.log(data);
			if (data !== undefined){
				this.setState({ district: data});
				return;
			}
			this.setState({street :[]});
			this.setState({district :[]});
			// console.log(data);

		});
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
			console.log(res.data.data[1][1]);
            console.log("citySelected = " + this.state.citySelected);
            console.log("districtSelected = " + this.state.districtSelected);
			var data = res.data.data[this.state.citySelected][this.state.districtSelected];
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

	render() {
		// const { description, imageFile } = this.state;
		return (

			<form onSubmit={this.onSubmit} encType="multipart/form-data">
				<NotificationContainer />
				<div className="title-header text-center mb-3">Cập nhật bài viết</div>
				<div className="form-group row">
					<label htmlFor="name" className="col-sm-2 form-control-label">Tên món ăn</label>
					<div className="col-sm-10">
						<input type="text" className="form-control" name="name" id="name" placeholder="Nhập tên món ăn" value={this.state.name} onChange={this.onChange} onInvalid={this.onInvalid}/>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label mb-3">Loại món ăn</label>
					<div className="col-sm-10">
						<div className="form-row">

							<div className="col-md-12 mb-3">
								<select className="custom-select" name="category" onChange={this.handleCateChange} onInvalid={this.onInvalid} required>
								<option value="" disabled selected>Loại</option>
								{
									this.state.cate.map((cat, index) =>

                                        this.food.category_id === cat.cate_id ?
                                        (<option key={index} value={cat.cate_id} selected> {cat.cate_name}</option>)
                                        : (<option key={index} value={cat.cate_id} >{cat.cate_name}</option>)
									)
								}
								</select>
						  	</div>
						</div>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="description" className="col-sm-2 form-control-label">Miêu tả</label>
					<div className="col-sm-10">
						<input type="text" className="form-control" name="description" id="description" value={this.state.description} placeholder="Miêu tả món ăn" onChange={this.onChange} onInvalid={this.onInvalid} required/>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="price" className="col-sm-2 form-control-label">Giá</label>
					<div className="col-sm-10">
						<input type="text" className="form-control" name="price" id="price" placeholder="Giá thành" value={this.state.price} onChange={this.onChange} onInvalid={this.onInvalid} required/>
					</div>
				</div>

				<div className="form-group row">
					<label htmlFor="restaurant" className="col-sm-2 form-control-label">Nhà hàng</label>
					<div className="col-sm-10">
						<input type="text" className="form-control" name="restaurant" id="restaurant" value={this.state.restaurant} placeholder="Nhập nhà hàng" onChange={this.onChange} onInvalid={this.onInvalid} required/>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label mb-3">Địa chỉ</label>
					<div className="col-sm-10">
						<div className="form-row">

							<div className="col-md-4 mb-3">
								<select className="custom-select" name="cityOpt" onChange={this.handleCityChange} onInvalid={this.onInvalid} required>
									<option value="" disabled selected>Tỉnh/Thành phố</option>
									{
										this.state.city.map((ct, index) =>
                                            this.food.city_id === ct.city_id ?
                                            (<option key={index} value={ct.city_id} selected>{ct.city_name}</option>)
											: (<option key={index} value={ct.city_id}>{ct.city_name}</option>)
									  	)
									}
								</select>
						  	</div>

						  	<div className="col-md-4 mb-3">
								<select className="custom-select" name="districtOpt" onChange={this.handleDistrictChange} onInvalid={this.onInvalid} required>
									<option value="" disabled selected>Quận/Huyện</option>
									{
										this.state.district.map((dist, index) =>
                                            this.food.district_id === dist.district_id ?
                                            (<option key={index} value={dist.district_id} selected>{dist.district_name}</option>)
							            	:(<option key={index} value={dist.district_id}>{dist.district_name}</option>)
							            )
									}
								</select>
						  	</div>

						  	<div className="col-md-4 mb-3">
								<select className="custom-select" name="streetOpt" onChange={this.handleStreetChange} onInvalid={this.onInvalid} required>
									<option value="" disabled selected>Đường/Phố</option>
									{
										this.state.street.map((str, index) =>
                                            this.food.street_id === str.street_id ?
                                            (<option key={index} value={str.street_id} selected>{str.street_name}</option>)
											:(<option key={index} value={str.street_id}>{str.street_name}</option>)
									  	)
									}
								</select>
						  	</div>
						</div>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="addNumber" className="col-sm-2 form-control-label">Số nhà/Ngõ</label>
					<div className="col-sm-10">
						<input type="text" className="form-control" name="addressDetail" id="addNumber" value={this.state.addressDetail} placeholder="Chi tiết số nhà/ngõ" onChange={this.onChange} onInvalid={this.onInvalid} required/>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label">Ảnh và Video</label>
					<div className="col-sm-10">
						<div className="form-row">
							<div className="col-sm-6 mb-3">
								<input className="custom-file-input" id="imageFile" name="imageFile"  type="file" accept="image/*" multiple='multiple' onChange={this.onChange}/>
							  	<label className="custom-file-label"  htmlFor="imageFile">{this.state.listFileName}</label>
								<input className="custom-file-input d-none" name="uploadFile" multiple='multiple'/>
							</div>
							<div className="col-sm-6 mb-3">
								<input className="custom-file-input" id="videoFile" name="videoFile"  type="file" accept="video/*" multiple='multiple' onChange={this.onChange}/>
								<label className="custom-file-label"  htmlFor="videoFile">{this.state.listFileName}</label>
							</div>
						</div>
					</div>
				</div>
				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label"></label>
					<div className="col-sm-10">
						<div className="form-row">
							<button type="submit" className="btn btn-info col-sm-3 mb-3">Sửa bài</button>
                            <a href={'/food-info/' +  this.food.id} className="btn btn-danger col-sm-3 mb-3 ml-2">Thoát</a>
						</div>
					</div>
				</div>
			</form>
		);
	}
}
export default FoodEdit
