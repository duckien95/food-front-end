import React from "react";
import axios from "axios";
import Services from "./service/Service"
var Service = new Services();

class Demo extends React.Component {
    constructor() {
        super()

        this.state = {
          latitude: '',
          longitude: '',
          name: '',
          result:[]
        }

        this.getMyLocation = this.getMyLocation.bind(this)
      }
      componentWillMount(){
          console.log(this.props.location);
      }


      componentDidMount() {
        this.getMyLocation()
        console.log(Service.test());
      }

      getMyLocation() {
        const location = window.navigator && window.navigator.geolocation
        if (location) {


          location.getCurrentPosition((position) => {
              console.log(position.coords);
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          }, (error) => {
            this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
          })
        }

      }

      render() {
        const { latitude, longitude } = this.state

        return (
          <div>
            <input type="text" value={latitude} />
            <input type="text" value={longitude} />
          </div>
        )
      }
}

export default Demo;

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    onChange(e){
        const state = this.state;
        state[e.target.name] =  e.target.value;
        console.log("diss");
        this.setState(state)

    }

    onSubmit(e){
        e.preventDefault();
        console.log("disss"
        );
        var formData = new FormData();
        formData.append("exam", "diss");
        console.log(formData);

        axios.post("http://localhost:8000/api/food/search", this.state)
        .then(res => {
            console.log("post");
        })
    }

    render(){
        return (
            <div>
            <form onSubmit={this.onSubmit}>
                <input onChange={this.onChange} name="exam" required/>
                <input onChange={this.onChange} type="text" name="content"required/>
   			 <select class="custom-select" name="cate" onChange={this.onChange}>
   			  <option value="-1" selected>Open this select menu</option>
   			  <option value="1">One</option>
   			  <option value="2">Two</option>
   			  <option value="3">Three</option>
   			</select>
   			<select class="custom-select" name="detail" onChange={this.onChange}>
   			 <option value="-1" selected>Open this select menu</option>
   			 <option value="1">One</option>
   			 <option value="2">Two</option>
   			 <option value="3">Three</option>
   		   </select>
           <button type="submit" value="upload" class="btn btn-primary">Submit</button>
            </form>
            </div>
        );
    }
}
