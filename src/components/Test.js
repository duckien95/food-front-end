import React from "react";
import axios from "axios";
import { findDOMNode } from "react-dom";
import ReactDOM from 'react-dom';
import Services from "./service/Service"
import $ from 'jquery'
var Service = new Services();

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            slideIndex : 1
        };
        this.onChange = this.onChange.bind(this);
        this.plusSlides = this.plusSlides.bind(this);
        this.currentSlide = this.currentSlide.bind(this);
        this.showSlides = this.showSlides.bind(this);
    }

    plusSlides(n){
        console.log(n);
        const state = this.state;
        state.slideIndex += n;
        this.showSlides(state.slideIndex);
        this.setState(state);
    }
    currentSlide(n){
        console.log(n);
        const state = this.state;
        state.slideIndex = n;
        this.showSlides(state.slideIndex);
        this.setState(state);
    }

    showSlides(n){
        var i;
          var slides = $('.mySlides');
          var dots =$('.column').children();
          console.log(slides.length);
          console.log(dots.length);
          var captionText = document.getElementById("caption");
          if (n > slides.length) {this.state.slideIndex = 1}
          if (n < 1) {this.state.slideIndex = slides.length}
          for (i = 0; i < slides.length; i++) {
              slides[i].style.display = "none";
          }
          for (i = 0; i < dots.length; i++) {
              dots[i].className = dots[i].className.replace(" active", "");
          }
          slides[this.state.slideIndex-1].style.display = "block";
          dots[this.state.slideIndex-1].className += " active";
          captionText.innerHTML = dots[this.state.slideIndex-1].alt;
    }


    onChange(e){
        const state = this.state;
        state[e.target.name] =  e.target.value;
        console.log("diss");
        this.setState(state)

    }
    componentDidMount(){
        var slide = $('.mySlides');
        console.log(slide.length);
        var dots =  $('.column').children();
        console.log(dots.length);
    }
    render(){
        return (
            <div class="container">
  <div class="mySlides">
    <div class="numbertext">1 / 6</div>
    <img src="https://www.w3schools.com/howto/img_woods_wide.jpg" class="max-width"/>
  </div>

  <div class="mySlides">
    <div class="numbertext">3 / 6</div>
    <img src="https://www.w3schools.com/howto/img_fjords_wide.jpg" class="max-width"/>
  </div>

  <div class="mySlides">
    <div class="numbertext">4 / 6</div>
    <img src="https://www.w3schools.com/howto/img_lights_wide.jpg" class="max-width"/>
  </div>


  <a class="prev" onClick={this.plusSlides(-1)}>❮</a>
  <a class="next" onClick={this.plusSlides(1)}>❯</a>

  <div class="caption-container">
    <p id="caption"></p>
  </div>

  <div class="row">
    <div class="column">
      <img class="demoSlides cursor" src="https://www.w3schools.com/howto/img_woods.jpg" class="max-width" onClick={this.currentSlide(1)} alt="The Woods"/>
    </div>
    <div class="column">
      <img class="demoSlides cursor" src="https://www.w3schools.com/howto/img_fjords.jpg" class="max-width" onClick={this.currentSlide(2)} alt="Trolltunga, Norway"/>
    </div>
    <div class="column">
      <img class="demoSlides cursor" src="https://www.w3schools.com/howto/img_lights.jpg" class="max-width" onClick={this.currentSlide(3)} alt="Mountains and fjords"/>
    </div>

  </div>
</div>
        );
    }
}

class FullDesc extends React.Component {
 constructor() {
 super();
 }
handleToggle = () => {
 const el = findDOMNode(this.refs.slides);
  console.log($(el));
 $(el).slideToggle();

 };
render() {
 return (
 <div className="long-desc">
  <ul className="profile-info" ref="slides" onClick={this.handleToggle}>
   <li>
     <span className="info-title">User Name : </span> Shuvo Habib
   </li>
 </ul>
<ul className="profile-info additional-profile-info-list" ref="slides">
  <li>
    <span className="info-email">Office Email</span> me@shuvohabib.com
  </li>
 </ul>
  <div className="ellipsis-click" onClick={this.handleToggle}>Click
    <i className="fa-ellipsis-h"/>
  </div>
 </div>
 );
 }
}
export default Test;
