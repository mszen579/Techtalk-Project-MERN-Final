//Home.js
import React, { Component } from "react";
import axios from "axios";
import Navigator from "./Navigator";
import Allposts from "./Allposts";
import { Link } from 'react-router-dom';//this is for routing

axios.defaults.withCredentials = true;// this is getting credentials

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state={
        user:null,
        error:'Please Login'

    }
    axios.get('http://localhost:8000/api/currentuser')
    .then(function(result){
        console.log(result);
        this.setState({
            user: result.data,
            error: ''
        })
    }.bind(this))
    .catch(error => console.log(error))   
    
}

 render() {

   return (
     <div>
     <h1>TechTalks</h1>
     <h3>Latest Articles</h3>
     { this.state.user && <h1> Hello, {this.state.user.name}</h1> }
      {this.state.user &&
      <Link className='btn nav-link btn-danger' to='/Logout'>
      Log out
      </Link>}
      <br />
      {this.state.user &&
    <Link className="btn nav-link btn-success" to="/articles/new">
    Post listing
    </Link>}
    {/* <br />
    {this.state.user &&
    // <Link className="btn nav-link btn-primary" to="/Allusers">
    // See all users
    // </Link>}
      <br /> */}
     <Navigator user={this.state.user} />
     <Allposts />

     </div>
   );
 }
}