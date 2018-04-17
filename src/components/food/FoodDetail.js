import React from 'react'
import axios from 'axios'
import Services from "../service/Service"
const Service = new Services();

class FoodDetail extends React.Component {
    constructor() {
        super();
        this.state = {
            foodData: [],
            videoUrl: [],
        }
    }


    componentDidMount(){
        console.log(this.props.location);
        var foodId = this.props.match.params.foodId;
        axios.get(Service.getServerHostName() + '/api/food/' + foodId)
        .then(res => {
            // console.log(res.data.data['videoUrl']);
            var data = res.data.data;
            console.log(res.data.data.videoUrl);
            this.setState({ foodData: data, videoUrl : data.videoUrl });
        })
    }

    render(){

        function NumberList(props) {
              const numbers = props.numbers;
              const listItems = numbers.map((number) =>
                <li>{number}</li>
              );
              return (
                <ul>{listItems}</ul>
              );
            }

            var link = ["an", "nam"]
        return(
            <div class="row">
                <div class="col-md-4">
                    <NumberList numbers={["an","nam",3,4]} />
                </div>
                <div class="col-md-8">
                {
               this.state.videoUrl.map((video) =>
                   <iframe width="500px" height="100%" src={"https://drive.google.com/file/d/" + video + "/preview"}></iframe>
               )
           }
                </div>

                <div class="col-md-12"></div>
            </div>

        )
    }
}

export default FoodDetail;
