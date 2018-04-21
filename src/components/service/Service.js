import React from "react"

class Service extends React.Component{
    constructor(){
        super();
        this.getServerHostName = this.getServerHostName.bind(this);
        this.getListDistance = this.getListDistance.bind(this);
    }

    getServerHostName() {
        return 'http://localhost:8000';
    }

    getListDistance(){
        return  [
            {value : '0.5', name : '0.5 km'},
            {value : '1.0', name : '1.0 km'},
            {value : '1.5', name : '1.5 km'},
            {value : '2.0', name : '2.0 km'},
            {value : '2.5', name : '2.5 km'},
            {value : '3.0', name : '3.0 km'},
            {value : '3.5', name : '3.5 km'},
            {value : '4.0', name : '4.0 km'},
        ]
    }
}

export default Service;
