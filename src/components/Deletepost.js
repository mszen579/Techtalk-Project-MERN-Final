//Deletepost.js
import React, { Component } from 'react'
import axios from 'axios';


export default class Deleteone extends Component {
       //deleting post             
       deletePost = (event, id) => {
        const url = "http://localhost:8000/api/deletepost/"+this.props.match.params.id;
        axios.delete(url)
        .then((response)=> {
            // alert("Are you sure You want to Delete it?");
            console.log(response);
            
            window.location.href = "/";
        
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <p>Are you sure? </p>
                <button className="btn btn-danger" onClick={this.deletePost} >Yes </button>
            </div>
        )
    }
}
