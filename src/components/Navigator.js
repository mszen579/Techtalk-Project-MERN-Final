//Navigator.js
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


class Navigator extends Component {

 render() {

   return <div className="Navbtn">
       <ul className="nav justify-content-center">
         <li className="nav-item" />
         <br />
         <li className="nav-item">
           <br />
           {!this.props.user && 
           <Link className="btn nav-link btn-success" to="/articles/join">
             Login and Register
           </Link>
           }
         </li>
       </ul>
     </div>;
 }
}

export default Navigator;