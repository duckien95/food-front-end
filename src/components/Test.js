import React from "react";


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
    }

    render(){
        return (
            <div>
            <form onSubmit={this.onSubmit}>
                <input onChange={this.onChange} name="exam" required/>
                <button type="button">click</button>
            </form>
            </div>
        );
    }
}

export default Test;
