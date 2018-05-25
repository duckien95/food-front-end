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
            <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">
  Tooltip on top
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">
  Tooltip on right
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">
  Tooltip on bottom
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">
  Tooltip on left
</button>
            <div class="wrapper row">

                <div className="col-md-2">
                    <nav id="sidebar">
                      <div class="sidebar-header">
                          <h3>Bootstrap Sidebar</h3>
                      </div>

                      <ul class="list-unstyled components">
                          <p>Dummy Heading</p>
                          <li class="active">
                              <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false">Home</a>
                              <ul class="collapse list-unstyled" id="homeSubmenu">
                                  <li><a href="#">Home 1</a></li>
                                  <li><a href="#">Home 2</a></li>
                                  <li><a href="#">Home 3</a></li>
                              </ul>
                          </li>
                          <li>
                              <a href="#">About</a>
                              <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false">Pages</a>
                              <ul class="collapse list-unstyled" id="pageSubmenu">
                                  <li><a href="#">Page 1</a></li>
                                  <li><a href="#">Page 2</a></li>
                                  <li><a href="#">Page 3</a></li>
                              </ul>
                          </li>
                          <li>
                              <a href="#">Portfolio</a>
                          </li>
                          <li>
                              <a href="#">Contact</a>
                          </li>
                      </ul>

                      <ul class="list-unstyled CTAs">
                          <li><a href="https://bootstrapious.com/tutorial/files/sidebar.zip" class="download">Download source</a></li>
                          <li><a href="https://bootstrapious.com/p/bootstrap-sidebar" class="article">Back to article</a></li>
                      </ul>
                    </nav>
                </div>

                <div id="content" className="col-md-10">
                    <nav class="navbar navbar-default">
                      <div class="container-fluid">

                          <div class="navbar-header">
                              <button type="button" id="sidebarCollapse" class="btn btn-info navbar-btn">
                                  <i class="glyphicon glyphicon-align-left"></i>
                                  <span>Toggle Sidebar</span>
                              </button>
                          </div>

                          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                              <ul class="nav navbar-nav navbar-right">
                                  <li><a href="#">Page</a></li>
                                  <li><a href="#">Page</a></li>
                                  <li><a href="#">Page</a></li>
                                  <li><a href="#">Page</a></li>
                              </ul>
                          </div>
                      </div>
                    </nav>

                    <h2>Collapsible Sidebar Using Bootstrap 3</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                    <div class="line"></div>

                    <h2>Lorem Ipsum Dolor</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                    <div class="line"></div>

                    <h2>Lorem Ipsum Dolor</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                    <div class="line"></div>

                    <h3>Lorem Ipsum Dolor</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>


            </div>
        </div>

        );
    }
}

export default Test;
