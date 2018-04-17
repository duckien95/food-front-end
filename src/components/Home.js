import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
class Home extends Component {

  constructor(props){
   super(props);
   this.state = {
   name:'',
   redirect: false,
   products:[],
   pid:''
   };
  }

  componentDidMount() {
    // let data = sessionStorage.getItem('userData');
        let data = JSON.parse(sessionStorage.getItem('userData'));
    console.log("Home.js data = " + data);
    console.log(data.firstName);
    this.setState({name: data.firstName + " " +  data.lastName})
  }

  render() {

    if(!sessionStorage.getItem('userData') || this.state.redirect){
      return (<Redirect to={'/'}/>)
    }

    if(this.state.pid > 0){
      return (<Redirect to={'/checkout'}/>)
    }

    return (
      <div >
      Welcome {this.state.name}
      </div>
    );
  }
}

export default Home;
