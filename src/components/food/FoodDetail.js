import React from 'react'
import axios from 'axios'
import Services from "../service/Service"
import {Link} from 'react-router-dom'
import $ from "jquery";
const Service = new Services();

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
        console.log(localStorage.getItem('user'));
        console.log('compare state vs undefined ' + (this.state.user !== undefined));
        console.log('compare state vs null ' + (this.state.user !== null));


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
                    var originPlace = (data.street_number + ', ' + data.street_name + ', ' + data.district_name + ', ' + data.city_name);
                    var nearbyUrl = originPlace.split(',').join('').replace(/\s/g, "-");
                    var res_name = data.restaurant_name;
                    this.setState({
                        food: data,
                        videoUrl : data.videoUrl,
                        imageUrl : data.imageUrl,
                        nearbyUrl : nearbyUrl,
                        origin : originPlace,
                        res_name : res_name
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
                var list = e.target.files;
                var name = "";
                for(var i=0; i < list.length; i++){
                    name += list[i].name + ', ';
                }
                state.imageMsg = name.slice(0, -1);
                break;

            case 'videoFile':

                state.videoFile = e.target.files;
                list = e.target.files;
                name = "";
                for(i=0; i < list.length; i++){
                    name += list[i].name + ', ';
                }
                state.videoMsg = name.slice(0, -1);
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

        return(
            <div className="row">
                <div className="col-md-4 no-padding">
                    <div className="card video-drive">
                        <div className="card-header text-center">
                            THÔNG TIN MÓN ĂN
                        </div>
                        <div className="card-body">

                        <table className="table">
                            <thead className="col-md-3">
                                <th scope="row">Tên</th>
                                <th scope="row">{this.state.food.name}</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td scope="row" >Nhà hàng</td>
                                    <td>{this.state.food.restaurant_name}</td>
                                </tr>
                                <tr>
                                    <td scope="row">Giá</td>
                                    <td>{this.state.food.prices} VND</td>
                                </tr>
                                <tr>
                                    <td scope="row">Địa chỉ</td>
                                    <td>
                                    <Link to={{  pathname: '/nearby/' + this.state.nearbyUrl, query: { origin: this.state.origin, res_name : this.state.res_name, food_id : this.state.food.id }} }>
                                        {this.state.food.street_number + ', ' + this.state.food.street_name + ',  ' + this.state.food.district_name + ',  ' + this.state.food.city_name }
                                    </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="row">Loại</td>
                                    <td><Link to={'/food-category/' + this.state.food.category_id}>{this.state.food.cate_name}</Link></td>
                                </tr>
                            </tbody>
                            </table>
                            <button className={this.state.liked ? 'btn btn-warning col-md-4' : 'btn btn-success col-md-4'} id="likeBtn" onClick={this.onLike}>
                                {this.state.liked ? 'Bỏ thích' : 'Thích'}
                                <span className="fa fa-thumbs-o-up pl-2"></span>
                            </button>
                            <button className={this.state.favorited ? 'btn btn-warning ml-3' : 'btn btn-success ml-3'} id="favoriteBtn" onClick={this.onFavoriteList}>
                                {this.state.favorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                <span className="fa fa-bell pl-2"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8 no-padding">
                    {
                       this.state.videoUrl.map((video) =>
                           <iframe className="max-width video-drive" key="key" src={"https://drive.google.com/file/d/" + video + "/preview"}></iframe>
                       )
                    }
                </div>
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-sm">
                            <button id="approvePost" className="max-width btn btn-info" onClick={this.onApprove}>Duyệt bài</button>
                        </div>
                        <div className="col-sm">
                            <button id="deletePost" className="max-width btn btn-danger"  onClick={this.onDelete}>Xóa bài</button>
                        </div>
                        <div className="col-sm">
                            <a href={'/food/edit/' + this.state.food.id} className="max-width btn btn-primary" id="editPost"> Sửa bài</a>
                        </div>
                        <div className="col-sm">

                            <button type="button" class="btn btn-success max-width" onClick={this.onOpenAddFile} data-toggle="modal" data-target="#myModal">Thêm ảnh/video</button>


                              <div class="modal fade" id="myModal" role="dialog">
                                <div class="modal-dialog modal-dialog-centered" id="modalIV">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h4 class="modal-title text-center">Thêm ảnh và video</h4>
                                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <form onSubmit={this.onAddImgVideo} encType="multipart/form-data">

                                            <div className="col-sm-12 mb-3">
                                                <input className="custom-file-input" id="imageFile" name="imageFile"  type="file" accept="image/*" multiple='multiple' onChange={this.onChange}/>
                                                <label className="custom-file-label"  htmlFor="imageFile">{this.state.imageMsg}</label>
                                                <input className="custom-file-input d-none" name="uploadFile" multiple='multiple'/>
                                            </div>
                                            <div className="col-sm-12 mb-3">
                                                <input className="custom-file-input" id="videoFile" name="videoFile"  type="file" accept="video/*" multiple='multiple' onChange={this.onChange}/>
                                                <label className="custom-file-label"  htmlFor="videoFile">{this.state.videoMsg}</label>
                                                <input className="custom-file-input d-none" name="uploadFile" multiple='multiple'/>
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
                    <div className="col-md-12">
                        <div className="title px-1 py-1">Ảnh về món ăn</div>
                        <div className="row">
                            {
                                this.state.imageUrl.map((img) =>
                                    <div className="col-md-4  px-1 py-1">
                                        <img key={img} src={"https://drive.google.com/uc?export=view&id=" + img } alt="" className="home-image" />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div class="col-md-12 alert-danger">

                    <button type="button" class="btn btn-primary" id="hiddenModal" data-toggle="modal" data-target="#alertModal" hidden>
                        Open modal
                    </button>

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
                                <div className="col-xs-6 col-md-4 suggest px-1 py-1">
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
                                                    <li className="li-child-suggest">{'Đăng bởi ' + food.username}</li>
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
