import React from "react";
import axios from "axios";
import Services from "./service/Service";
import $ from 'jquery'
var Service = new Services();



var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content:'',
            comments : []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.converDateTime = this.converDateTime.bind(this);
        this.notifyMe = this.notifyMe.bind(this);
    }

    notifyMe(){
        $('#div1').fadeIn();
        $('#div1').fadeOut(3000);
    }
    componentDidMount(){

        var food_id = 74;
        axios.get(Service.getServerHostName() + '/api/comments/' + food_id)
        .then(
            res =>{
                this.setState({ comments : res.data.data})
            }
        )
    }

    handleTextChange(e){
        this.setState({ content : e.target.value })
    }

    handleSubmit(e){
        e.preventDefault();
        var user_id =  15;
        var username = 'hello';
        var food_id = 74;
        var content = this.state.content;
        var dateNow = new Date()
        var date = [dateNow.getFullYear() ,dateNow.getMonth()+1,
              dateNow.getDate()
              ].join('-')+' '+
             [dateNow.getHours(),
              dateNow.getMinutes(),
              dateNow.getSeconds()].join(':');
        console.log('submit');
        var temp = this.state.comments;
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

    converDateTime(time){
        var date = new Date(time);
        var day = date.getDate();
        var month = date.getMonth() +  1;
        var hour = date.getHours() ;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return (day > 9 ? '' : '0') + day + ' - ' +
            ( month > 9 ? '' : '0') + month  + ' - ' +
            date.getFullYear() + ' ' +
            hour + ' : ' +
            (minute > 9 ? '' : '0') + minute + ' : ' +
            (second > 9 ? '' : '0') + second ;
    }


    render(){
        const { comments } = this.state;
        return (
            <div>
            <button onClick={this.notifyMe}>Notify me!</button>
            <div className="text-success" id="div1">Hello World</div>
            {
                comments.map( (comment,index) =>
                    <div key={index}>
                    <a className="text-danger">{comment.username}</a>
                    {comment.content + ' ' + this.converDateTime(comment.date)}

                    </div>
                )
            }
            <form className="commentForm" onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="content"
                placeholder="Say something..."
                value={this.state.content}
                onChange={this.handleTextChange}
              />
              <input type="submit" value="Post" />
            </form>
            </div>
        );
    }
}

export default Test;
