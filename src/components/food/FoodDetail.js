import React from 'react'
import axios from 'axios'
import Services from "../service/Service"
import AuthService from '../authenticate/AuthService'
import {Link} from 'react-router-dom'
import Lightbox from 'react-image-lightbox';
import $ from "jquery";
const Service = new Services();
const Auth = new AuthService();

class FoodDetail extends React.Component {
    constructor() {
        super();

        this.state = {
            nearbyUrl: '',
            origin : '',
            res_name : '',
            food: [],
            videoUrl: [],
            imageUrl: [],
            sameCateList:[],
            liked: '',
            favorited:'',
            imageFile: [],
            videoFile: [],
            imageMsg: 'Chọn ảnh',
            videoMsg: 'Chọn video',
            user : JSON.parse(localStorage.getItem('user')),
            photoIndex: 0,
            isOpen: false,
            images : []
        }

        this.onApprove = this.onApprove.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onLike = this.onLike.bind(this);
        this.onFavoriteList = this.onFavoriteList.bind(this);
        this.checkLikeFavorite = this.checkLikeFavorite.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onOpenAddFile = this.onOpenAddFile.bind(this);
        this.onAddImgVideo = this.onAddImgVideo.bind(this);
    }

    onOpenAddFile(e){
        $('#modalIV')[0].style.visibility = "hidden";
        e.preventDefault();
        let userLocal = localStorage.getItem('user');
        if(userLocal === null){
            $('#hiddenModal')[0].click();
        }
        else {
            $('#modalIV')[0].style.visibility = "visible";
        }
    }

    checkLikeFavorite(){
        let userLocal = localStorage.getItem('user');
        if(userLocal !== null){
            console.log("not null");
            return axios.get(Service.getServerHostName() + '/api/like-favorite/' + this.props.match.params.foodId + '/' + this.state.user.id)
            .then(
                res => {
                    var data = res.data;
                    console.log(data);
                    this.setState({
                        liked: data.like,
                        favorited : data.favorite
                    });
                    return "okheee";
                }
            )
        }
        else{
            return axios.get(Service.getServerHostName() + '/api/cities')
            .then(
                res => {
                    return res;
                }
            )
        }
    }

    componentDidMount(){

        Auth.setDownloadPermission();
        $( document ).ready(function() {
            $('.home-image').contextmenu(function() {
                return false;
                // alert( "Hello World!" );
            });

            console.log($(document).find('.home-image').length);
        });


        // console.log(localStorage.getItem('user'));
        // console.log('compare state vs undefined ' + (this.state.user !== undefined));
        // console.log('compare state vs null ' + (this.state.user !== null));


        $('#approvePost')[0].style.visibility='hidden';
        $('#editPost')[0].style.visibility='hidden';
        $('#deletePost')[0].style.visibility='hidden';

        this.checkLikeFavorite()
        .then(
            res => {
                // console.log(res);
                // console.log(res);
                // console.log("like" + this.state.liked);
                // console.log("favorite" + this.state.favorited);
            }
        ).then(
            res => {

                var foodId = this.props.match.params.foodId;
                return axios.get(Service.getServerHostName() + '/api/food/' + foodId)
                .then(res => {
                    var data = res.data.data;
                    console.log(data);
                    console.log(res.data.data.videoUrl);
                    // var originPlace = (data.street_number + ', ' + data.street_name + ', ' + data.district_name + ', ' + data.city_name);
                    var originPlace = '';
                    originPlace += (data.street_number.length > 10) ? data.street_number : (data.street_number + ", " + data.street_name);
                    originPlace += ", " + data.district_name + ", " + data.city_name;
                    // console.log(originPlace);
                    var nearbyRaw =  originPlace.split(',').join('');
                    nearbyRaw = nearbyRaw.replace('/', '-');
                    nearbyRaw = nearbyRaw.replace(/\s/g, "-");
                    var nearbyUrl = nearbyRaw;
                    var res_name = data.restaurant_name;
                    var imageSrc = data.imageUrl;
                    var src = [];
                    for (var i = 0; i < imageSrc.length; i++) {
                        src.push('https://drive.google.com/uc?export=view&id=' + imageSrc[i]);
                    }

                    this.setState({
                        food: data,
                        videoUrl : data.videoUrl,
                        imageUrl : data.imageUrl,
                        nearbyUrl : nearbyUrl,
                        origin : originPlace,
                        res_name : res_name,
                        images: src
                    });

                    if(this.state.user !== null){
                        if(this.state.user.type === "admin"){
                            $('#deletePost')[0].style.visibility='visible';
                            $('#editPost')[0].style.visibility='visible';
                            if(data.status === "pending"){
                                $('#approvePost')[0].style.visibility='visible';
                            }
                        }
                    }

                    return data.category_id;
                })
            }
        ).then(
            res => {
               axios.get(Service.getServerHostName() + '/api/food-category/' + res)
               .then(res => {
                   this.setState({ sameCateList : res.data.data })
               })
           }
        )
    }

    onChange (e){
        const state = this.state;

        switch (e.target.name) {
            case 'imageFile':

				state.imageFile = e.target.files;
				var files = e.target.files;
				var name = "";
				for(var i=0; i < files.length; i++){
					name += files[i].name + ', ';
				}
				var preview = $('#previewImages').empty();
		        // console.log(files);
		        if(files.length){
		            var preview = document.getElementById("previewImages");
		            for (var i = 0; i < files.length; i++) {
		                var file = files[i];
		                var reader = new FileReader();
		                reader.onload = function (e) {
		                    var divElement = document.createElement("div");
							divElement.className = "col-md-4 my-2";
							var img = document.createElement("img");
							img.height = "175";
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
				var files = e.target.files;
				var name = "";
				for(var i=0; i < files.length; i++){
					name += files[i].name + ', ';
				}
				var preview = $('#previewVideos').empty();
		        // console.log(files);
		        if(files.length){
		            var preview = document.getElementById("previewVideos");
		            for (var i = 0; i < files.length; i++) {
		                var file = files[i];
		                var reader = new FileReader();
		                reader.onload = function (e) {
		                    var divElement = document.createElement("div");
							divElement.className = "col-md-4 my-2";
							var video = document.createElement("video");
							var source  = document.createElement('source');
							video.height = "175";
							video.className = "max-width"
							source.src = window.URL.createObjectURL(file);
							video.appendChild(source);
							// video.load(e.target.result);
							divElement.appendChild(video);
							preview.appendChild(divElement);
		                }

		            	reader.readAsDataURL(file);
		            }

		        }
				break;

            default :
                // console.log('default');
                break;
        }

        this.setState(state);
    }



    onAddImgVideo(e) {
        console.log(this.state.user !== null);
        e.preventDefault();

        if(this.state.user !== null){

            const {imageFile, videoFile} = this.state;

            let formData = new FormData();
            var foodId = this.props.match.params.foodId;

            formData.append("food_id", foodId);

            for(var i=0; i < imageFile.length; i++){
                console.log(imageFile[i]);
                formData.append('uploadFile', imageFile[i]);
            }

            for(i=0; i < videoFile.length; i++){
                console.log(videoFile[i]);
                formData.append('uploadFile', videoFile[i]);
            }

            console.log(formData);

            axios.post(Service.getServerHostName() + "/food/add-media-file", formData)
            .then((result) => {
                    window.location.reload();
            })
        }
        else {
            $('#hiddenModal')[0].click();
            // alert("Đăng nhập để có thể tương tác")
        }
    }

    onLike(e){
        if(this.state.user !== null){
            var user_id = this.state.user.id;
            var food_id = this.state.food.id;
            if(this.state.liked){
                axios.post(Service.getServerHostName() + '/food/dislike', {user_id, food_id})
                .then(res => {
                    console.log(res);
                    if(res.status === 200){
                        this.setState({ liked : false})
                    }
                })
            }
            else {
                axios.post(Service.getServerHostName() + '/food/like', {user_id, food_id})
                .then(res => {
                    console.log(res);
                    if(res.status === 200){
                        this.setState({ liked : true})
                    }
                })
            }
        }
        else {
            $('#hiddenModal')[0].click();
            // alert("Đăng nhập để có thể tương tác")
        }


    }

    onFavoriteList(e){
        if(this.state.user !== null){
            var user_id = this.state.user.id;
            var food_id = this.state.food.id;
            if(this.state.favorited){

                axios.post(Service.getServerHostName() + '/food/disfavorite', {user_id, food_id})
                .then(res => {
                    console.log(res);
                    if(res.status === 200){
                        this.setState({ favorited : false});
                    }
                })
            }
            else {

                axios.post(Service.getServerHostName() + '/food/favorite', {user_id, food_id})
                .then(res => {
                    if(res.status === 200){
                        this.setState({ favorited : true});
                    }
                })
            }
        }
        else {
            $('#hiddenModal')[0].click();
            // alert("Đăng nhập để có thể tương tác")
        }

    }
    onApprove(e){
        axios.get(Service.getServerHostName() + '/food/approve/' + this.state.food.id)
        .then(res => {
            console.log(res);
            if(res.status === 200){
                console.log("approve success");
                window.location.reload();
            }
        })
    }

    onDelete(e){
        axios.get(Service.getServerHostName() + '/food/delete/' + this.state.food.id)
        .then(res => {
            console.log(res.status);
            console.log(res.status === 200 );
            if(res.status === 200){
                this.props.history.replace('/');
            }
        })
        console.log('delete');
    }



    render(){
        const { photoIndex, isOpen, images, imageUrl, food, videoUrl, favorited, liked, nearbyUrl, origin, res_name } = this.state;

        return(
            <div className="row">
                <div className="col-md-5 no-padding">
                    <div className="card video-drive">
                        <div className="card-header text-center">
                            {food.name}
                        </div>
                        <div className="card-body">

                        <table className="table">

                            <tbody>
                                <tr>
                                    <td >Nhà hàng</td>
                                    <td>{food.restaurant_name}</td>
                                </tr>
                                <tr>
                                    <td>Giá</td>
                                    <td>{food.prices} VND</td>
                                </tr>
                                <tr>
                                    <td>Địa chỉ</td>
                                    <td>
                                    <Link to={{  pathname: '/nearby/' + nearbyUrl, state : { origin: origin, res_name : res_name, food_id : food.id }} }>
                                        {food.street_number + ', ' + food.street_name + ',  ' + food.district_name + ',  ' + food.city_name }
                                    </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Loại</td>
                                    <td><Link to={'/food-category/' + food.category_id}>{food.cate_name}</Link></td>
                                </tr>
                                <tr>
                                    <td>Chi tiết</td>
                                    <td>{food.description}</td>
                                </tr>
                            </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                <div className="col-md-7 no-padding">
                    {
                       videoUrl.map((video, index) =>
                           <iframe key={index} className="max-width video-drive" title={index} src={"https://drive.google.com/file/d/" + video + "/preview"}></iframe>
                       )
                    }
                </div>

                <div className="col-md-7 offset-md-5">
                    <div className="row">

                        <div className="col-sm">
                            <button className={liked ? 'btn btn-warning max-width' : 'btn btn-success max-width'} id="likeBtn" onClick={this.onLike}>
                                {liked ? 'Bỏ thích' : 'Thích'}
                                <span className="fa fa-thumbs-o-up pl-2"></span>
                            </button>
                        </div>
                        <div className="col-sm">
                            <button className={favorited ? 'btn btn-warning max-width' : 'btn btn-success max-width'} id="favoriteBtn" onClick={this.onFavoriteList}>
                                {favorited ? 'Bỏ lưu bài viết' : 'Lưu lại bài viết'}
                                <span className="fa fa-bell pl-2"></span>
                            </button>
                        </div>
                        <div className="col-sm">

                            <button type="button" class="btn btn-success max-width" onClick={this.onOpenAddFile} data-toggle="modal" data-target="#myModal">Thêm ảnh/video</button>


                              <div class="modal fade" id="myModal" role="dialog">
                                <div class="modal-dialog modal-dialog-centered modal-lg" id="modalIV">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h4 class="modal-title text-center">Thêm ảnh và video</h4>
                                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <form onSubmit={this.onAddImgVideo} encType="multipart/form-data">

                                            <div className="col-sm-12 mb-3">
                                                <div className="custom-file">
                                                    <input className="custom-file-input" id="imageFile" name="imageFile"  type="file" accept="image/*" multiple='multiple' onChange={this.onChange} required/>
                                                    <label className="custom-file-label" htmlFor="imageFile">Tải ảnh lên...</label>
                                                    <input className="custom-file-input" name="uploadFile" multiple='multiple' hidden/>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 mb-3">
                                                <div id="previewImages" className="form-row">
                                                </div>
                                            </div>
                                            <div className="col-sm-12 mb-3">
                                                <div className="custom-file">
                                                    <input className="custom-file-input" id="videoFile" name="videoFile"  type="file" accept="video/*" multiple='multiple' onChange={this.onChange}/>
                                                    <label className="custom-file-label"  htmlFor="videoFile">Tải video lên...</label>
                                                    <input className="custom-file-input d-none" name="uploadFile" multiple='multiple'/>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 mb-3">
                                                <div id="previewVideos" className="form-row">
                                                </div>
                                            </div>
                                            <div className="form-group float-right">
                            					<button type="submit" className="btn btn-info">Thêm</button>
                            				</div>

                                        </form>
                                    </div>

                                  </div>

                                </div>
                              </div>
                        </div>

                    </div>
                </div>
                <div className="col-md-12 mt-2">
                    <div className="row">
                        <div className="col-sm">
                            <button id="approvePost" className="max-width btn btn-info" onClick={this.onApprove}>Duyệt bài</button>
                        </div>
                        <div className="col-sm">
                            <button id="deletePost" className="max-width btn btn-danger"  onClick={this.onDelete}>Xóa bài</button>
                        </div>
                        <div className="col-sm">
                            <a href={'/food/edit/' + food.id} className="max-width btn btn-primary" id="editPost"> Sửa bài</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="title px-1 py-1">Ảnh về món ăn</div>
                    <div className="row">
                        {
                            this.state.imageUrl.map((img) =>
                                <div className="col-md-4  px-1 py-1" key={img}  onClick={() => this.setState({ isOpen: true })}>
                                    <img  alt={img} src={"https://drive.google.com/uc?export=view&id=" + img } alt="" className="home-image" />
                                </div>
                            )
                        }
                    </div>

                    {isOpen && (
                      <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                          this.setState({
                            photoIndex: (photoIndex + images.length - 1) % images.length,
                          })
                        }
                        onMoveNextRequest={() =>
                          this.setState({
                            photoIndex: (photoIndex + 1) % images.length,
                          })
                        }
                      />
                     )}
                </div>
                    <div class="col-md-12 alert-danger">



                        <div class="modal fade" id="alertModal">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">

                                    <div class="modal-header">
                                        <h4 class="modal-title">THÔNG BÁO</h4>
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    </div>

                                    <div class="modal-body">
                                        Bạn phải đăng nhập để có thể  thích, lưu bài viết và tải ảnh lên
                                    </div>

                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="title px-1 py-1">
                            {this.state.food.cate_name} tại {this.state.food.city_name}
                        </div>
                        <div className="row">
                        {
                            this.state.sameCateList.map((food,index) =>
                                <div className="col-xs-6 col-md-4 suggest px-1 py-1" key={index}>
                                    <a href={"/food-info/" + food.id}>
                                        <div className="food-suggest">
                                            <img  src={"https://drive.google.com/uc?export=view&id=" + (food.imageUrl[0] ?  food.imageUrl[0] : "19RNB4mhAvMXI_6ohPkYyc4l9Nv_OeMGW")} alt="" className="home-image" />

                                            <div className="food-detail-suggest">
                                                <div  className="icon-heart-suggest">
                                                    <span   className="glyphicon glyphicon-heart"></span>
                                                    <span  className="glyphicon glyphicon-heart"></span>
                                                </div>
                                                <ul className="food-detail-info-suggest">
                                                    <li className="li-price-suggest"></li>
                                                    <li className="li-child-suggest">
                                                        <span> {food.name} </span>

                                                    </li>
                                                    <li className="li-child-suggest"><span> {food.prices}</span></li>
                                                    <li className="li-child-suggest">{food.street_number + ' ' + food.street_name + ', ' + food.district_name + ', ' + food.city_name }</li>
                                                    <li className="li-child-suggest">{'Đăng bởi ' + food.first_name}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
        )
    }
}

export default FoodDetail;
