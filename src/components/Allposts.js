//Allposts.js
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Nav from './Nav';


function Result2(props) {


    return (
                // <h1>random article</h1>
                 <ul className='users' key={props.randomone._id}>
                <div className="card-body">
                   <h2 className="card-title">{props.randomone.title}</h2>
                     <h4 className="card-title">{props.randomone.user.name}</h4>
                     <h4 className="card-text"></h4>
                 <Link className='btn btn-primary' to={'/articles/'+props.randomone._id}>Random Post Details</Link>
                     {/* <Comment /> */}
                     <hr />
                 </div>
                 </ul>
                 
                 
      
    )
}
function Result(props) {


    return (
       

        props.posts.map((post)=>{
            return <ul className="users" key={post._id}>
                <div className="card-body">
                  <h2 className="card-title">{post.title}</h2>
                  <h4><Link className="" to={"/articles/author/" + post.user._id}>
                  See this user's posts [ {post.user.name} ] 
                  </Link></h4>
                  <h4 className="card-text" />
                  <Link className="btn btn-primary" to={"/articles/" + post._id}>
                    Post Details
                  </Link>
                  <h3>Number of Votes: {post.vote}</h3>
                  <button className="btn btn-success" onClick={props.handleVote.bind(this, post._id)}>
                    Like
                  </button>
                  <button className="btn btn-warning" onClick={props.handleUnVote.bind(this, post._id)}>
                    Un-Like
                  </button>
                  {props.user && props.user._id === post.user._id && <Link className="btn btn-danger"  to={"/deletepost/" + post._id}>
                        Delete
                      </Link>}

                  {/* <Comment  /> */}
                  <hr />
                </div>
              </ul>;
        })
    )
}

class Allposts extends Component {
  constructor(props) {
    super(props);
    this.state = { posts: null, randomone: null, user: null };
  }
  componentDidMount() {
    axios
      .get("http://localhost:8000/api/Allposts/")
      .then(res => this.setState({ posts: res.data }));

    axios.get("http://localhost:8000/api/getrandomone").then(randomone => {
      this.setState({ randomone: randomone.data });
    });

    axios
      .get("http://localhost:8000/api/currentuser")
      .then(
        function(result) {
          console.log(result);
          this.setState({
            user: result.data,
            error: ""
          });
        }.bind(this)
      )
      .catch(error => console.log(error));
  }

  deletePost = (event, id) => {
    const url =
      "http://localhost:8000/api/deletepost/" + this.props.match.params.id;
    axios
      .delete(url)
      .then(response => {
        // alert("Are you sure You want to Delete it?");
        console.log(response);

        window.location.href = "/";
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleVote(id) {
    console.log("hi");
    axios
      .put("http://localhost:8000/api/post/vote/" + id)
      .then(result => {
        window.location.href = "/";
      })
      .catch(error => console.log(error));
  }

  handleUnVote(id) {
    console.log("hi");
    axios
      .put("http://localhost:8000/api/post/unvote/" + id)
      .then(result => {
        window.location.href = "/";
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        {this.state.randomone && <Result2 randomone={this.state.randomone} />}
        {this.state.posts && (
          <Result
            user={this.state.user}
            posts={this.state.posts}
            handleUnVote={this.handleUnVote}
            handleVote={this.handleVote}
          />
        )}
      </div>
    );
  }
}

export default Allposts;