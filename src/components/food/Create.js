import React from 'react';
import Services from "../service/Service.js"
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from 'axios'
import $ from 'jquery'
const Service = new Services();
class FoodCreate extends React.Component {

	constructor(props) {
		super(props);
		this.user = JSON.parse(localStorage.getItem('user'));
		this.state = {
			name: '',
			description: '',
			price : '',
			min_price: '',
			max_price: 0,
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
		axios.get(Service.getServerHostName() + '/api/city/list').then(res => {
			this.setState({ city: res.data.data });
			// console.log(this.state.city);
		});

		axios.get(Service.getServerHostName() + "/api/category").then(res => {
			this.setState({cate : res.data.data})
		});
	}

	onChange (e){
		const state = this.state;

		switch (e.target.name) {
			case 'imageFile':

				state.imageFile = e.target.files;
				var files = e.target.files;
				var name = "";
				for(let i=0; i < files.length; i++){
					name += files[i].name + ', ';
				}
				state.listImageName = name.slice(0, -1);
				var preview = $('#previewImages').empty();
		        // console.log(files);
		        if(files.length){
		            preview = document.getElementById("previewImages");
		            for (let i = 0; i < files.length; i++) {
		                let file = files[i];
		                let reader = new FileReader();
		                reader.onload = function (e) {
		                    let divElement = document.createElement("div");
							divElement.className = "col-md-3 my-1";
							let img = document.createElement("img");
							img.height = "200";
							img.className = "max-width"
							img.src = e.target.result;
							divElement.appendChild(img);
							preview.appendChild(divElement);
		                }

		            	reader.readAsDataURL(file);
		            }

		        }

				break;

			case 'videoFile':

				state.videoFile = e.target.files;
				files = e.target.files;
				for(let i=0; i < files.length; i++){
					name += files[i].name + ', ';
				}
				state.listImageName = name.slice(0, -1);
				var previewVideos = $('#previewVideos').empty();
		        // console.log(files);
		        if(files.length){
		            previewVideos = document.getElementById("previewVideos");
		            for (let i = 0; i < files.length; i++) {
		                let file = files[i];
		                let videoReader = new FileReader();

		                videoReader.onload = function (e) {
		                    let divElement = document.createElement("div");
							divElement.className = "col-md-3 my-1";
							let video = document.createElement("video");
							let source  = document.createElement('source');
							video.height = "200";
							video.className = "max-width"
							source.src = window.URL.createObjectURL(file);
							video.appendChild(source);
							// video.load(e.target.result);
							divElement.appendChild(video);
							previewVideos.appendChild(divElement);
		                }

		            	videoReader.readAsDataURL(file);
		            }

		        }
				break;

			default:
				state[e.target.name] = e.target.value;

		}
		e.target.setCustomValidity('');

		this.setState(state);
	}

	onSubmit(e) {
		// console.log("before");
		// console.log($("#name").val());
		// this.props.history.replace('/food/create', { msg : 'Thành công', title: 'Đăng bài viết', timeOut: 2000 })
		e.preventDefault();


		const { name, description, min_price, max_price, category, detail, restaurant, citySelected, districtSelected, streetSelected, addressDetail, imageFile, videoFile} = this.state;

		let formData = new FormData();

		formData.append('name', name);
		formData.append('description', description);
		formData.append('min_price', min_price);
		formData.append('max_price', max_price);
		formData.append('city', citySelected);
		formData.append('district', districtSelected);
		formData.append('street', streetSelected);
		formData.append('street_number', addressDetail);
		formData.append('category', category);
		formData.append('detail', detail);
		formData.append("owner_id", this.user.id);
		formData.append('restaurant_name', restaurant);

		for(var i=0; i < imageFile.length; i++){
			console.log(imageFile[i]);
			formData.append('uploadFile', imageFile[i]);
		}

		if(videoFile.length){
			for(i=0; i < videoFile.length; i++){
				console.log(videoFile[i]);
				formData.append('uploadFile', videoFile[i]);
			}
		}
		// console.log(formData);

		axios.post(Service.getServerHostName() + "/food/create", formData)
		.then( res => {
			console.log(res);
			if(res.data.status === 'success'){
				window.location.replace("/food/create");
				// window.location.replace('/');
				NotificationManager.success('Thành công','Đăng bài viết',3000);
				// this.props.history.replace('/food/list', { msg : 'Thành công', title: 'Đăng bài viết', timeOut: 2000 })
			}
			else {
				NotificationManager.error('Bài viết chưa được đăng', 'Có lỗi xảy ra');
			}

				// this.props.history.replace("/");
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
		// console.log(cate_id);
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
			// console.log(res.data.streetList);
			var data = res.data.data[this.state.citySelected][districtID];
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
				<div className="title-header text-center mb-3">Đăng bài viết mới</div>
				<div className="form-group row">
					<label htmlFor="name" className="col-sm-2 form-control-label">Tên món ăn</label>
					<div className="col-sm-10">
						<input type="text" className="form-control" name="name" id="name" placeholder="Nhập tên món ăn" onChange={this.onChange} onInvalid={this.onInvalid} required/>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label mb-3">Loại món ăn</label>
					<div className="col-sm-10">
						<div className="form-row">

							<div className="col-md-12 mb-3">
								<select className="custom-select" onChange={this.handleCateChange} onInvalid={this.onInvalid} required>
								<option value="" disabled selected>Loại</option>
								{
									this.state.cate.map((cat, index) =>
										<option key={index} value={cat.cate_id}>
											{cat.cate_name}
										</option>
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
						<input type="text" className="form-control" name="description" id="description" placeholder="Miêu tả món ăn" onChange={this.onChange} onInvalid={this.onInvalid} required/>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label mb-3">Giá</label>
					<div className="col-sm-10">
						<div className="form-row">
						<div className="col-sm">
							<input type="number" className="form-control" name="min_price" placeholder="Giá tối thiểu" onChange={this.onChange} onInvalid={this.onInvalid} required/>
						</div>
						<div className="col-sm">
							<input type="number" className="form-control" name="max_price" placeholder="Giá tối đa" onChange={this.onChange} onInvalid={this.onInvalid} required/>
						</div>
						</div>
					</div>
				</div>

				<div className="form-group row">
					<label htmlFor="restaurant" className="col-sm-2 form-control-label">Nhà hàng</label>
					<div className="col-sm-10">
						<input type="text" className="form-control" name="restaurant" id="restaurant" placeholder="Nhập nhà hàng" onChange={this.onChange} onInvalid={this.onInvalid} required/>
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
											<option key={index} value={ct.city_id}>
											{ct.city_name}
											</option>
									  	)
									}
								</select>
						  	</div>

						  	<div className="col-md-4 mb-3">
								<select className="custom-select" name="districtOpt" onChange={this.handleDistrictChange} onInvalid={this.onInvalid} required>
									<option value="" disabled selected>Quận/Huyện</option>
									{
										this.state.district.map((dist, index) =>
							            	<option key={index} value={dist.district_id}>
							                	{dist.district_name}
							              	</option>
							            )
									}
								</select>
						  	</div>

						  	<div className="col-md-4 mb-3">
								<select className="custom-select" name="streetOpt" onChange={this.handleStreetChange} onInvalid={this.onInvalid} required>
									<option value="" disabled selected>Đường/Phố</option>
									{
										this.state.street.map((str, index) =>
											<option key={index} value={str.street_id}>
										  		{str.street_name}
											</option>
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
						<input type="text" className="form-control" name="addressDetail" id="addNumber" placeholder="Chi tiết số nhà/ngõ" onChange={this.onChange} onInvalid={this.onInvalid} required/>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label">Ảnh</label>
					<div className="col-sm-10">
						<div className="custom-file">
						  	<input className="custom-file-input" id="imageFile" name="imageFile"  type="file" accept="image/*" multiple='multiple' onChange={this.onChange} required/>
						  	<label className="custom-file-label" htmlFor="imageFile">Tải ảnh lên...</label>
						  	<input className="custom-file-input" name="uploadFile" multiple='multiple' hidden/>
						</div>
					</div>
				</div>

				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label"></label>
					<div className="col-sm-10">
						<div id="previewImages" className="form-row">
						</div>
					</div>
				</div>


				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label">Video</label>
					<div className="col-sm-10">
						<div className="custom-file">
							<input className="custom-file-input" id="videoFile" name="videoFile"  type="file" accept="video/*" multiple='multiple' onChange={this.onChange}/>
							<label className="custom-file-label"  htmlFor="videoFile">Tải video lên...</label>
							<input className="custom-file-input d-none" name="uploadFile" multiple='multiple'/>
						</div>
					</div>
				</div>
				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label"></label>
					<div className="col-sm-10">
						<div id="previewVideos" className="form-row">
						</div>
					</div>
				</div>
				<div className="form-group row">
					<label  htmlFor="address" className="col-sm-2 form-control-label"></label>
					<div className="col-sm-10">
						<div className="form-row">
							<button type="submit" className="btn btn-info col-sm-3 mb-3">Đăng bài</button>
						</div>
					</div>
				</div>
			</form>

		);
	}
}
export default FoodCreate
