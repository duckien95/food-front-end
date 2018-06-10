import React from 'react'
import axios from 'axios'
import Services from "../service/Service"
import AuthService from '../authenticate/AuthService'
import { Link, Redirect } from 'react-router-dom'
import Food from './FoodTemplate'
import Lightbox from 'react-image-lightbox';
import {NotificationContainer, NotificationManager} from 'react-notifications';
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
            imagePending : [],
            videoPending: [],
            sameCateList:[],
            liked: '',
            favorited:'',
            avatar: '',
            imageFile: [],
            videoFile: [],
            imageMsg: 'Chọn ảnh',
            videoMsg: 'Chọn video',
            user : JSON.parse(localStorage.getItem('user')),
            photoIndex: 0,
            isOpen: false,
            images : [],
            content : '',
            comments : [],
            listFileId: [],
            message: ''
        }

        this.ImageSrcLightbox = this.ImageSrcLightbox.bind(this);
        this.onApprove = this.onApprove.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onLike = this.onLike.bind(this);
        this.onFavoriteList = this.onFavoriteList.bind(this);
        this.checkLikeFavorite = this.checkLikeFavorite.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onOpenAddFile = this.onOpenAddFile.bind(this);
        this.onAddImgVideo = this.onAddImgVideo.bind(this);
        // this.onApproveImage = this.onApproveImage.bind(this, 'img', 'index');
        // this.onDisapproveImage = this.onDisapproveImage.bind(this);
        // this.onApproveVideo = this.onApproveVideo.bind(this);
        // this.onDisapproveVideo = this.onDisapproveVideo.bind(this);
        this.handleSubmitComment = this.handleSubmitComment.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.converDateTime = this.converDateTime.bind(this);
        this.Service = new Services();
    }

    ImageSrcLightbox(list, stateName){
        var src = [];
        for (var i = 0; i < list.length; i++) {
            src.push('https://drive.google.com/uc?export=view&id=' + list[i]);
        }
        const state = this.state;
        state[stateName] = src;
        this.setState(state);
    }

    componentDidMount(){

        Auth.setDownloadPermission();
        $( document ).ready(function() {
            $('.home-image').contextmenu(function() {
                return false;
                // alert( "Hello World!" );
            });

            // console.log($(document).find('.home-image').length);
        });

        // console.log('componentDidMount');


        // console.log(localStorage.getItem('user'));
        // console.log('compare state vs undefined ' + (this.state.user !== undefined));
        // console.log('compare state vs null ' + (this.state.user !== null));


        $('#approvePost')[0].style.visibility='hidden';
        $('#editPost')[0].style.visibility='hidden';
        $('#deletePost')[0].style.visibility='hidden';

        this.checkLikeFavorite()
        .then(
            res => {
                console.log(res);
                // console.log(res);
                // console.log(res);
                // console.log("like" + this.state.liked);
                // console.log("favorite" + this.state.favorited);
            }
        ).then(
             res => {
                axios.get(Service.getServerHostName() + '/api/comments/' + this.props.match.params.foodId)
                .then(
                    res =>{
                    var comment = res.data.data;
                        if(comment.length){
                            this.setState({ comments : comment})
                        } else {
                            this.setState({ comments : []})
                        }
                    }
                )
             }
        ).then(
            res => {

                var foodId = this.props.match.params.foodId;
                return axios.get(Service.getServerHostName() + '/api/food/' + foodId)
                .then(res => {
                    var data = res.data.data;
                    console.log(data);
                    console.log(data.listFileId);
                    // console.log(res.data.data.imageUrl.approve);
                    // console.log(res.data.data.videoUrl.approve);
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
                    var imageSrc = data.imageUrl.approve;
                    var imageSrcPending = data.imageUrl.pending;
                    this.ImageSrcLightbox(imageSrc, 'src');
                    this.ImageSrcLightbox(imageSrcPending, 'srcPending');
                    // var src = [];
                    // for (var i = 0; i < imageSrc.length; i++) {
                    //     src.push('https://drive.google.com/uc?export=view&id=' + imageSrc[i]);
                    // }
                    //
                    // var srcPending = [];
                    // for (var i = 0; i < imageSrcPending.length; i++) {
                    //     srcPending.push('https://drive.google.com/uc?export=view&id=' + imageSrcPending[i]);
                    // }

                    console.log();

                    this.setState({
                        food: data,
                        videoUrl : data.videoUrl.approve,
                        imageUrl : data.imageUrl.approve,
                        videoPending : data.videoUrl.pending,
                        imagePending : data.imageUrl.pending,
                        nearbyUrl : nearbyUrl,
                        origin : originPlace,
                        res_name : res_name,
                        listFileId: data.listFileId,
                        avatar: data.avatar
                    });

                    if(this.state.user !== null){
                        if(this.state.user.type !== "normal"){
                            $('#admin-act').removeClass('d-none');
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
                   this.setState({ sameCateList : res.data.foods })
               })
           }
       )
    }

    handleTextChange(e){
        this.setState({ content : e.target.value })
    }

    handleSubmitComment(e){
        e.preventDefault();
        if(this.state.user !== null){
            const { user } = this.state;
            var user_id =  user.id;
            var username = user.username !== null ? user.username : ( user.first_name + ' ' + user.last_name );
            var food_id = this.props.match.params.foodId;
            var content = this.state.content;
            var dateNow = new Date();
            var date = [dateNow.getFullYear() ,dateNow.getMonth()+1,
                  dateNow.getDate()
                  ].join('-')+' '+
                 [dateNow.getHours(),
                  dateNow.getMinutes(),
                  dateNow.getSeconds()].join(':');
            console.log('submit');
            var temp = this.state.comments;
            if(content.length){
                this.setState({ message: '' })
                var newComments = temp.concat({
                    user_id : user_id,
                    username : username,
                    content :content,
                    food_id: food_id,
                    date : date
                });
                this.setState({ comments :  newComments});

                axios.post(Service.getServerHostName() + '/api/add-comment', {user_id, username, content, food_id, date})
                .then(
                    res => {
                        // console.log(res);
                        if(res.data.status === 'success'){
                            // console.log('post comment success');
                            this.setState({ content : '' });
                        }
                    }
                )
            }
            else {
                this.setState({ message: 'Nội dung bình luận không được để trống' })
            }
        } else {
            $('#hiddenModal')[0].click();
        }
    }

    converDateTime(time){
        var date = new Date(time);
        var day = date.getDate();
        var month = date.getMonth() +  1;
        var hour = date.getHours() ;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return (day > 9 ? '' : '0') + day + '-' +
            ( month > 9 ? '' : '0') + month  + '-' +
            date.getFullYear() + ' ' +
            hour + ':' +
            (minute > 9 ? '' : '0') + minute + ':' +
            (second > 9 ? '' : '0') + second ;
    }

    onDeleteComment = (comment_id) => (e) => {
        e.preventDefault();
        axios.post(Service.getServerHostName() + '/api/delete-comment', { comment_id })
        .then(
            res => {
                if(res.data.status === 'success'){
                    NotificationManager.info('Thành công', 'Xóa bình luận');
                    axios.get(Service.getServerHostName() + '/api/comments/' + this.props.match.params.foodId)
                    .then(
                        res =>{
                        var comment = res.data.data;
                            if(comment.length){
                                this.setState({ comments : comment})
                            } else {
                                this.setState({ comments : []})
                            }
                        }
                    )
                }
                else {
                    NotificationManager.error('Bình luận chưa được xóa', 'Có lỗi xảy ra')
                }
            }
        )
        // console.log(comment_id);
    }

    onDeleteVideo = (file_id) => (e) => {
        axios.post(Service.getServerHostName() + '/food/video/disapprove/' + this.state.food.id + '/' + file_id)
        .then(
            res => {
                // console.log(res);
                if(res.data.status === 'success'){
                    NotificationManager.info('Thành công', 'Xóa video');
                    var videoUrl = this.state.videoUrl;
                    var index = videoUrl.indexOf(file_id);
                    videoUrl.splice(index, 1);
                    this.setState({
                        videoUrl: videoUrl
                    })
                }
                else {
                    NotificationManager.error('Video chưa được xóa', 'Có lỗi xảy ra')
                }
            }
        )
    }

    onDeleteImage = (file_id) => (e) => {
        axios.post(Service.getServerHostName() + '/food/image/disapprove/' + this.state.food.id + '/' + file_id)
        .then(
            res => {
                console.log(res);
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Xóa ảnh')
                    var imageUrl = this.state.imageUrl;
                    // console.log(imageUrl);
                    var index = imageUrl.indexOf(file_id);
                    imageUrl.splice(index, 1);

                    this.ImageSrcLightbox(imageUrl, 'src');

                    this.setState({
                        imageUrl: imageUrl,
                    })
                }
                else {
                    NotificationManager.error('Ảnh chưa được xóa', 'Có lỗi xảy ra')
                }
            }
        )
    }

    onSetAvatar = (file_id) => (e) => {
        var food_id = this.state.food.id;
        axios.post(Service.getServerHostName() + '/food/set-avatar', { food_id, file_id })
        .then(
            res => {
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Đặt ảnh đại diện')
                    this.setState({
                        avatar: file_id
                    })
                }
                else {
                    NotificationManager.error('', 'Có lỗi xảy ra')
                }
            }
        )
    }

    onApproveImage = (file_id) => (e) => {
        // console.log('click');

        // console.log(e.target);
        // console.log(e.target.indexfile);
        // console.log(e.target.value);
        // var file_id = e.target.value;
        axios.post(Service.getServerHostName() + '/food/image/approve/' + this.state.food.id + '/' + file_id)
        .then(
            res => {
                // console.log(res);
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Ảnh được duyệt')
                    var imagePending = this.state.imagePending;
                    // console.log(imagePending);
                    var index = imagePending.indexOf(file_id);
                    imagePending.splice(index, 1);
                    var imageApprove = this.state.imageUrl;
                    imageApprove.push(file_id);

                    this.ImageSrcLightbox(imagePending, 'srcPending');
                    this.ImageSrcLightbox(imageApprove, 'src');

                    this.setState({
                        imageUrl: imageApprove,
                        imagePending: imagePending
                    })
                }
                else {
                    NotificationManager.error('Ảnh chưa được duyệt', 'Có lỗi xảy ra')
                }
            }
        )
    }

    onDisapproveImage = (file_id) => (e) => {
        // var file_id = e.target.value;
        // console.log(file_id);

        axios.post(Service.getServerHostName() + '/food/image/disapprove/' + this.state.food.id + '/' + file_id)
        .then(
            res => {
                // console.log(res);
                if(res.data.status === 'success'){

                    NotificationManager.info('Thành công', 'Xóa ảnh')
                    var imagePending = this.state.imagePending;
                    var index = imagePending.indexOf(file_id);

                    imagePending.splice(index, 1);
                    this.ImageSrcLightbox(imagePending, 'srcPending');
                    this.setState({
                        imagePending: imagePending
                    })
                }
                else {
                    NotificationManager.error('Ảnh chưa được xóa', 'Có lỗi xảy ra')
                }
            }
        )
    }

    onApproveVideo = (file_id) => (e) =>{
        // console.log(e.target.value);
        // var file_id = e.target.value;
        axios.post(Service.getServerHostName() + '/food/video/approve/' + this.state.food.id + '/' + file_id)
        .then(
            res => {
                // console.log(res);
                if(res.data.status === 'success'){
                    NotificationManager.success('Thành công', 'Video được duyệt')
                    var videoPending = this.state.videoPending;
                    // console.log(videoPending);
                    var index = videoPending.indexOf(file_id);
                    videoPending.splice(index, 1);
                    var videoApprove = this.state.videoUrl;
                    videoApprove.push(file_id);

                    this.setState({
                        videoUrl: videoApprove,
                        videoPending: videoPending
                    })
                }
                else {
                    NotificationManager.error('Video chưa được duyệt', 'Có lỗi xảy ra')
                }
            }
        )
    }

    onDisapproveVideo = (file_id) => (e) => {

        axios.post(Service.getServerHostName() + '/food/video/disapprove/' + this.state.food.id + '/' + file_id)
        .then(
            res => {
                // console.log(res);
                if(res.data.status === 'success'){
                    NotificationManager.info('Thành công', 'Xóa video')

                    var videoPending = this.state.videoPending;
                    var index = videoPending.indexOf(file_id);
                    videoPending.splice(index, 1);
                    this.setState({
                        videoPending: videoPending
                    })
                }
                else {
                    NotificationManager.error('Video chưa được xóa', 'Có lỗi xảy ra')
                }
            }
        )
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

    onChange (e){
        const state = this.state;

        switch (e.target.name) {
            case 'imageFile':

                state.imageFile = e.target.files;
                var files = e.target.files;
                // console.log("number of image : " + files.length);
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
                            divElement.className = "col-md-4 my-2";
                            let img = document.createElement("img");
                            img.height = "175";
                            img.className = "mx-100"
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
                            divElement.className = "col-md-4 my-2";
                            let video = document.createElement("video");
                            let source  = document.createElement('source');
                            video.height = "175";
                            video.className = "mx-100"
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

            const {imageFile, videoFile, user} = this.state;
            if(imageFile.length | videoFile.length){
                this.setState({
                    message: ''
                })
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
                formData.append('owner_id', user.id);

                // console.log(formData);

                axios.post(Service.getServerHostName() + "/food/add-media-file", formData)
                .then((result) => {
                    if(result.data.status === 'success'){
                        NotificationManager.info('Tệp tin đã được tải lên, hình ảnh và video cuả bạn sẽ được duyệt vào 24h hàng ngày', 'Thành công', 10000)
                        $('#closeModal')[0].click();
                        // window.location.reload();
                    }
                    else {
                        NotificationManager.error('Tệp tin chưa được tải lên', 'Có lỗi xảy ra')
                    }

                })
            }
            else {
                this.setState({
                    message: 'Bạn phải tải tệp tin lên'
                })
            }
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
                    // console.log(res);
                    if(res.data.status === 'success'){
                        // NotificationManager.error('Bạn đã bỏ thích bài viết', 'Cảnh báo');
                        this.setState({ liked : false});
                        axios.get(Service.getServerHostName() + '/api/food/' + this.props.match.params.foodId)
                        .then(res => {
                            var data = res.data.data;
                            // console.log(data);
                            this.setState({ food: data  })
                        })
                    }
                })
            }
            else {
                axios.post(Service.getServerHostName() + '/food/like', {user_id, food_id})
                .then(res => {
                    console.log(res);
                    if(res.data.status === 'success'){
                        NotificationManager.success('Bạn đã thích bài viết', 'Thông báo');
                        this.setState({ liked : true});
                        axios.get(Service.getServerHostName() + '/api/food/' + this.props.match.params.foodId)
                        .then(res => {
                            var data = res.data.data;
                            // console.log(data);
                            this.setState({ food: data  })
                        })
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
            // console.log(res);
            if(res.data.status === 'success'){
                window.location.reload();
                NotificationManager.success('Thành công', 'Duyệt bài viết');
			}
			else {
				NotificationManager.error('', 'Có lỗi xảy ra');
			}
        })
    }



    onDelete(e){
        e.preventDefault();

        var listFileId = this.state.listFileId;
        var food_id = this.state.food.id;

        // this.props.history.replace('/food/list', { msg : 'Thành công', title: 'Xóa bài viết', timeOut: 2000 })
        axios.post(Service.getServerHostName() + '/food/delete', { food_id, listFileId })
        .then(res => {

                // console.log(r);
            if(res.data.status === 'success'){
;
                // this.props.history.replace('/admin');
                $('.redirect')[0].click();
                NotificationManager.success('Thành công', 'Xóa bài viết', 3000);

            }
            else {
                NotificationManager.error('Bài viết chưa được xóa', 'Có lỗi xảy ra');
            }

        })
        // console.log('delete');
    }





    render(){
        const { comments, sameCateList, photoIndex, isOpen, images, avatar, imageUrl, food, videoUrl, imagePending, videoPending, src, srcPending, favorited, liked, nearbyUrl, origin, res_name } = this.state;

        return(
            <div className="row">
                <NotificationContainer/>
                <a href='/admin' className="btn redirect d-none">Redirect</a>
                <div className="col-md-12 px-1 mb-3 d-none" id="admin-act">
                    <div className="row">
                        <div className="col-sm">
                            <button id="approvePost" className="max-width btn btn-info" onClick={this.onApprove}>Duyệt bài<i className="fas fa-thumbs-up mx-2"></i></button>
                        </div>
                        <div className="col-sm">

                            <button id="deletePost" className="max-width btn btn-danger" data-toggle="modal" data-target="#deleteFood">Xóa bài<i className="far fa-trash-alt mx-2 "></i></button>
                            <div>
                                <div className="modal fade" id="deleteFood" role="dialog">
                                    <div className="modal-dialog modal-dialog-centered modal-md">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h4 className="modal-title text-center">Bạn có chắc chắn muốn xóa bài viết ?</h4>
                                          <button type="button" className="close closeDeleteModal" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={this.onDelete} >
                                                <div className="form-group float-right">
                                                    <button type="button" className="btn btn-info mx-2" data-dismiss="modal">Không</button>
                                                    <button type="submit" className="btn btn-danger ">Có</button>
                                                </div>

                                            </form>
                                        </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <Link to={'/food/edit/' + food.id} className="max-width btn btn-primary" id="editPost"> Sửa bài <i className="fa fa-edit mx-2"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-7 px-1 d-inline-flex">
                    <div className="card">
                        <div className="card-header text-center food-title">
                            {food.name}
                        </div>
                        <div className="card-body">

                        <table className="table table-food">
                            <tbody>
                                <tr>
                                    <td className="index-column">Nhà hàng</td>
                                    <td>{food.restaurant_name}</td>
                                </tr>
                                <tr>
                                    <td>Giá</td>
                                    <td>{ Service.formatMoney(`${food.min_price}`) + (Number(food.max_price) > 0 ? (' - ' + Service.formatMoney(`${food.max_price}`)) : '') } VND</td>
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
                                <tr>
                                    <td>Thích</td>
                                    <td className="index-color">{food.likes} lượt <i className="fas fa-heart"></i></td>
                                </tr>
                            </tbody>
                            </table>
                            <div className="row">

                                <div className="col-sm">
                                    <button className={liked ? 'btn btn-warning max-width' : 'btn btn-success max-width'} id="likeBtn" onClick={this.onLike}>
                                        {liked ? 'Bỏ thích' : 'Thích'}
                                        <span className="fas fa-heart pl-2"></span>
                                    </button>
                                </div>
                                <div className="col-sm">
                                    <button className={favorited ? 'btn btn-warning max-width' : 'btn btn-success max-width'} id="favoriteBtn" onClick={this.onFavoriteList}>
                                        {favorited ? 'Bỏ lưu món ăn' : 'Lưu lại món ăn'}
                                        <span className="fa fa-bell pl-2"></span>
                                    </button>
                                </div>
                                <div className="col-sm">

                                    <button type="button" className ="btn btn-success max-width" onClick={this.onOpenAddFile} data-toggle="modal" data-target="#myModal">Thêm ảnh/video</button>


                                      <div className    ="modal fade" id="myModal" role="dialog">
                                        <div className  ="modal-dialog modal-dialog-centered modal-lg" id="modalIV">
                                          <div className    ="modal-content">
                                            <div className  ="modal-header">
                                              <h4 className ="modal-title text-center">Thêm ảnh và video</h4>
                                              <button type="button" id="closeModal" className="close" data-dismiss="modal">&times;</button>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.onAddImgVideo} encType="multipart/form-data">
                                                    {
                                                        this.state.message === '' ?
                                                        '' :
                                                        (<div className="alert alert-danger col-md-12 text-center">
                                                            {this.state.message}
                                                        </div>)
                                                    }
                                                    <div className="col-sm-12 mb-3">
                                                        <div className="custom-file">
                                                            <input className="custom-file-input" id="imageFile" name="imageFile"  type="file" accept="image/*" multiple='multiple' onChange={this.onChange}/>
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
                    </div>
                </div>
                <div className="col-md-5 px-1 d-inline-flex">
                    <img alt={avatar} src={"https://drive.google.com/uc?export=view&id=" + avatar } className="w-100 index-img" onClick={() => this.setState({ isOpen: true, images : src })}/>
                </div>

                <div className="col-md-7">
                </div>



                { imageUrl.length > 0 ?
                    (
                        <div className="col-md-12">
                            <div className="title px-1 py-1">Ảnh về món ăn</div>
                            <div className="row">
                                {
                                    imageUrl.map((img, index) =>

                                        <div className="col-md-4 px-1 py-1" key={index}>
                                            <img  alt={img} src={"https://drive.google.com/uc?export=view&id=" + img } className="home-image" onClick={() => this.setState({ isOpen: true, images : src, photoIndex: index })}/>

                                            {  Auth.loggedIn()  && this.state.user.type === "admin" ? (
                                            <div className="row py-1">
                                                <div className="col-sm">
                                                    <button onClick={this.onDeleteImage(img)} className="btn btn-danger w-100">Xóa ảnh</button>
                                                </div>
                                                <div className="col-sm">
                                                    <button onClick={this.onSetAvatar(img)} className="btn btn-success w-100">Đặt làm đại diện</button>
                                                </div>
                                            </div> ) : '' }
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
                    ) : ''
                }
                {
                    videoUrl.length > 0 ?
                    (
                        <div className="col-md-12">
                            <div className="title px-1 py-1">Video món ăn</div>
                            <div className="row">

                                {
                                    videoUrl.map((video, index) =>
                                    <div className="col-md-6 px-1 py-1 d-inline-flex row" key={index}>
                                        <div className="col-md-12">
                                            <iframe key={index} className="w-100 video-drive" title={index} src={"https://drive.google.com/file/d/" + video + "/preview"}></iframe>

                                            {  Auth.loggedIn()  && this.state.user.type === "admin" ? (
                                                <div className="row py-1">
                                                    <div className="col-sm">
                                                        <button onClick={this.onDeleteVideo(video)} className="btn btn-danger w-100">Xóa video</button>
                                                    </div>
                                                </div>
                                            ) : '' }

                                        </div>
                                    </div>
                                    )
                                }

                            </div>
                        </div>
                    ) : ''
                }


                {Auth.loggedIn()  && this.state.user.type !== "normal" ?

                    (imagePending.length > 0 ?
                        (<div className="col-md-12">
                            <div className="title px-1 py-1">Ảnh chờ duyệt</div>
                            <div className="row">
                                {
                                    imagePending.map((img, index) =>

                                        <div className="col-md-4  px-1 py-1" key={index}>
                                            <img  alt={img} src={"https://drive.google.com/uc?export=view&id=" + img } className="home-image"   onClick={() => this.setState({ isOpen: true, images : srcPending, photoIndex: index  })}/>
                                            <div className="row py-1">
                                                <div className="col-sm">
                                                    <button onClick={this.onDisapproveImage(img)} className="btn btn-warning w-100">Không chấp nhận</button>
                                                </div>
                                                <div className="col-sm">
                                                    <button onClick={this.onApproveImage(img)} className="btn btn-info w-100">Duyệt</button>
                                                </div>
                                            </div>
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
                        </div>)
                    : '') : ''
                }
                {Auth.loggedIn()  && this.state.user.type !== "normal" ?


                    (videoPending.length > 0 ?
                        (<div className="col-md-12">
                            <div className="title px-1 py-1">Video chờ duyệt</div>
                            <div className="row">

                                {
                                    videoPending.map((video, index) =>
                                    <div className="col-md-6 px-1 py-1 d-inline-flex row">
                                            <div className="col-md-12">
                                                <iframe key={index} className="w-100 video-drive" title={index} src={"https://drive.google.com/file/d/" + video + "/preview"}></iframe>
                                            </div>

                                            <div className="col-sm">
                                                <button onClick={this.onDisapproveVideo(video)} className="btn btn-warning w-100">Không chấp nhận</button>
                                            </div>
                                            <div className="col-sm">
                                                <button onClick={this.onApproveVideo(video)} className="btn btn-info w-100">Duyệt</button>
                                            </div>

                                    </div>
                                    )
                                }

                            </div>

                        </div>)
                    : '') : ''
                }





                    <div className="col-md-12">
                        <button type="button" className="btn btn-info btn-lg" data-toggle="modal" id="hiddenModal" data-target="#alertModal" hidden>Open Modal</button>
                        <div className="modal fade" id="alertModal">
                            <div className="modal-dialog modal-dialog-centered modal-md">
                                <div className="modal-content alert-danger">

                                    <div className="modal-header">
                                        <h4 className="modal-title">THÔNG BÁO</h4>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>

                                    <div className="modal-body">
                                        <div className="alert-modal-text">
                                            Bạn phải đăng nhập để có thể  lưu bài viết, thích và tải ảnh lên
                                        </div>

                                        <a href="/login" className="btn btn-danger login-modal col-md-12">ĐĂNG NHẬP TẠI ĐÂY</a>
                                    </div>

                                    <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Đóng</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-12">
                        <div className="title px-1 py-1">Bình luận bài viết</div>

                        {
                            comments.map( (cmt,index) =>
                            <div className="my-2"  key={index}>
                                <div className="row">
                                    <div className="col-md-1 px-1 py-1">
                                        <img className="comment-avatar w-100" src="https://www.jennstrends.com/wp-content/uploads/2013/10/bad-profile-pic-2.jpeg" />
                                    </div>
                                    <div className="col-md-10 px-1 py-1">
                                        <div className='comment-username'>{cmt.username}</div>
                                        <div>{cmt.content}</div>
                                        <div className='comment-datetime'>{this.converDateTime(cmt.date)}</div>
                                    </div>
                                    {
                                        Auth.loggedIn()  && (this.state.user.type === "admin" || this.state.user.id === cmt.user_id) ? (
                                            <div className="col-md-1 px-1 py-1">
                                                <button onClick={this.onDeleteComment(cmt.id)} className="btn btn-danger float-right"><i className="far fa-trash-alt"></i></button>
                                            </div>
                                        ) : ''
                                    }

                                </div>
                            </div>
                            )
                        }
                        <div className="row my-2 px-1 py-1">
                        {
                            this.state.message === '' ?
                            '' :
                            (<div className="alert alert-danger col-md-12 text-center" id="msg">
                                {this.state.message}
                            </div>)
                        }
                        <form className="w-100" onSubmit={this.handleSubmitComment}>
                            <div className="form-group">
                                <textarea className="form-control" placeholder="Bình luận..." rows="5" id="comment" value={this.state.content} onChange={this.handleTextChange}></textarea>
                                <button className="btn btn-primary float-right">Bình luận</button>
                            </div>
                        </form>
                        </div>
                    </div>
                    <div className="col-md-12 mb-4">

                        <div className="title px-1 py-1">
                            {this.state.food.cate_name} tại {this.state.food.city_name}
                        </div>
                        <div className="row">
                        {
                            sameCateList.map((food,index) =>
                                <div className="col-xs-6 col-md-4 suggest px-1 py-1" key={index}>
                                    <a href={"/food-info/" + food.id}>
                                        <div>
                                            <img  src={Service.getServerHostName() + "/images/index.jpg"} className="home-image" />
                                        </div>
                                        <div className="food-detail-info px-2">
                                                <div className="food-title-name">
                                                    <span> {food.name} </span>

                                                </div>
                                                <div className="">
                                                    <span>
                                                        { Service.formatMoney(`${food.min_price}`) + (Number(food.max_price) > 0 ? (' - ' + Service.formatMoney(`${food.max_price}`)) : '') } VND
                                                    </span>
                                                </div>
                                                <div className="">{ food.street_number + ' ' + food.street_name + ', ' + food.district_name + ', ' + food.city_name }</div>
                                                {
                                                    food.distance !== undefined ? (<div className="li-child-suggest">Khoảng cách {food.distance}</div>) : ''
                                                }
                                                <div className="index-color"> {food.likes} lượt thích <i className="fas fa-heart"></i></div>

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
