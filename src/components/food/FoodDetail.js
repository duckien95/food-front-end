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
            user : JSON.parse(localStorage.getItem('user')),
        }

        this.onApprove = this.onApprove.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onLike = this.onLike.bind(this);
        this.onFavoriteList = this.onFavoriteList.bind(this);
    }

    componentWillMount(){
        if(this.state.user !== undefined){
            axios.get(Service.getServerHostName() + '/like-favorite/' + this.state.food.id + '/' + this.state.user.id)
            .then(
                res => {
                    var data = res.data;
                    console.log("componentWillMount");
                    console.log(data);
                    this.setState({
                        liked: data.like,
                        favorited : data.favorite
                    });

                }
            )
        }
    }

    onLike(e){
        var user_id = this.state.user.id;
        var food_id = this.state.food.id;
        if(this.state.liked){
            this.setState({ liked : false})
            // axios.post(Service.getServerHostName() + '/food/dislike', {user_id, food_id})
            // .then(res => {
            //     console.log(res);
            // })
        }
        else {
            this.setState({ liked : true})
            // axios.post(Service.getServerHostName() + '/food/like', {user_id, food_id})
            // .then(res => {
            //     console.log(res);
            // })
        }


    }

    onFavoriteList(e){
        var user_id = this.state.user.id;
        var food_id = this.state.food.id;
        if(this.state.favorited){
            this.setState({ favorited : false})
        }
        else {
            this.setState({ favorited : true})
        }
        // axios.post(Service.getServerHostName() + '/food/favorite', {user_id, food_id})
        // .then(res => {
        //     console.log(res);
        // })
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

    componentDidMount(){
        // $('#likeBtn').addClass('btn-success');
        console.log("eeee");
        console.log(this.state.user !== undefined);


        $('#approvePost')[0].style.visibility='hidden';
        $('#editPost')[0].style.visibility='hidden';
        $('#deletePost')[0].style.visibility='hidden';

        // console.log(this.props.location);
        var foodId = this.props.match.params.foodId;

        axios.get(Service.getServerHostName() + '/api/food/' + foodId)
        .then(res => {
            // console.log(res.data.data['videoUrl']);
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

            console.log(this.state.user.type === "admin");
            console.log(this.state.user.type);

            if(this.state.user.type === "admin"){
                $('#deletePost')[0].style.visibility='visible';
                $('#editPost')[0].style.visibility='visible';
                if(data.status === "pending"){
                    $('#approvePost')[0].style.visibility='visible';
                }
            }
            else {
                console.log("not admin");
            }
            return data.category_id;
            console.log(data.imageUrl);
        })
        .then(
            res => {
                axios.get(Service.getServerHostName() + '/api/food-category/' + res)
                .then(res => {
                    this.setState({ sameCateList : res.data.data })
                })
            }
        ).then(
            res => {

                if(this.state.user !== undefined){
                    axios.get(Service.getServerHostName() + '/like-favorite/' + this.state.food.id + '/' + this.state.user.id)
                    .then(
                        res => {
                            var data = res.data;
                            console.log("componentWillMount");
                            console.log(data);
                            this.setState({
                                liked: data.like,
                                favorited : data.favorite
                            });
                            return data;

                        }
                    )
                }
                else{
                    return "finish";
                }

            }
        ).then(
            res => {
                console.log("final");
                console.log(res);
            }
        )

        console.log("like = " + this.state.like);
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
                                    <Link to={{  pathname: '/nearby/' + this.state.nearbyUrl, query: { origin: this.state.origin, res_name : this.state.res_name, food : this.state.food }} }>
                                        {this.state.food.street_number + ', ' + this.state.food.street_name + ',  ' + this.state.food.district_name + ',  ' + this.state.food.city_name }
                                    </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="row">Loại</td>
                                    <td>{this.state.food.cate_name}</td>
                                </tr>
                            </tbody>
                            </table>
                            <button className={this.state.liked ? 'btn btn-warning ' : 'btn btn-success'} id="likeBtn" onClick={this.onLike}>
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
                           <iframe className="max-width video-drive" src={"https://drive.google.com/file/d/" + video + "/preview"}></iframe>
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
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="title-header px-1 py-1">Ảnh về món ăn</div>


                        <div className="row">
                            {
                                this.state.imageUrl.map((img) =>
                                    <div className="col-md-4  px-1 py-1">
                                        <img  src={"https://drive.google.com/uc?export=view&id=" + img } alt="" className="home-image" />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="title-header px-1 py-1">
                            {this.state.food.cate_name} tại {this.state.food.cityname}
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
