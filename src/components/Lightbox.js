import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import $ from 'jquery'
const images = [
  '//placekitten.com/1500/500',
  '//placekitten.com/4000/3000',
  '//placekitten.com/800/1200',
  '//placekitten.com/1500/1500',
];
class Upload extends React.Component {
    constructor(){
        super();
        this.previewImages = this.previewImages.bind(this);
        this.removeFile = this.removeFile.bind(this);

    }

    removeFile(e){
        console.log(e.target.attributes);
    }


    previewImages(e) {

        var $preview = $('#preview').empty();
        var files = e.target.files;
        console.log(files);
        if(files.length){
            var preview = document.getElementById("preview");
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = function (e) {
                        // var divElement = $('<div />', {
                        //                     "class": 'test',
                        //                     click: function(e){
                        //                         e.preventDefault();
                        //                         alert("test")
                        //                     }});
                        var divElement = document.createElement("div");
                        var button = document.createElement("button");
                        button.className = 'btn btn-danger';
                        button.textContent = "cancel";
                        divElement.className = "my-2"
                        // var divElement =  $("<div></div>");
                        button.addEventListener("click", function(e){
                            this.removeFile(e)
                        })
                        button.setAttribute("file_index", i);;
                       var img = document.createElement("IMG");
                       img.height = "100";
                       img.width = "100";
                       img.src = e.target.result;
                       divElement.appendChild(img);
                       divElement.appendChild(button);
                       preview.appendChild(divElement);
                   }
                   reader.readAsDataURL(file);
            }

        }

    }

    render(){
        return(
            <div>
                <input id="file-input" type="file" accept="image/*" multiple onChange={this.previewImages} />
                <div class="container">
                <div class ="" id="preview"></div>
                </div>
            </div>
        )
    }
}


export default Upload
