import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Nav from "./Nav";

function Result(props) {
  return props.posts.map(post => {
    {
       if (props.id == post.user._id) {
        return <ul className="users" key={post._id}>
            <div className="card-body">
              <h3 className="card-title">
                <b /> {post.title} by: {post.user.name}
              </h3>
              <p className="card-text">
                <b>keywords: </b> {post.keywords}
              </p>
              <p className="card-text">
                <b>Listed on: </b> {post.createdat}
              </p>

              <hr />

              <Link className="btn btn-primary" to={"/articles/" + post._id}>
                Post Details
              </Link>
            </div>
          </ul>;
          
      }
    }
  
  }


);
}

class SingleUserposts extends Component {
  constructor(props) {
    super(props);
    this.state = { posts: null, randomone: null };
  }
  componentDidMount() {
    axios
      .get("http://localhost:8000/api/usersposts/")
      .then(res => this.setState({ posts: res.data }));
  }

  render() {
    return <div>
        <h1>All posts listed by this user:</h1>
        {this.state.posts && <Result posts={this.state.posts} id={this.props.match.params._id} />}
        
        <br/>
        <Link className="btn btn-warning" to={"/"}>
          Back
        </Link>
      </div>;
  }
}

export default SingleUserposts;
