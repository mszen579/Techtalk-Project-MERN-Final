//Newlising.js
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; //this is for routing

export default class Newlising extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        title: "",
        desc: "",
        location: "",
        price: "",
        contact: ""
      },
      error: { title: "", desc: "", location: "", price: "", contact: "" },
      success: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  getCurrentUser() {
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

  handleChange(element) {
    var formData = this.state.data;
    formData[element.target.name] = element.target.value;
    this.setState({ data: formData });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    let _this = this;
    axios
      .post("http://localhost:8000/api/postlist", this.state.data)
      .then(res => {
        console.log("res", res);
        if (res.data.errors) {
          let mainErrors = res.data.errors;
          let err_msg = {
            title: mainErrors.title ? mainErrors.title.msg : "",
            keywords: mainErrors.keywords ? mainErrors.keywords.msg : "",
            oneSentence: mainErrors.oneSentence
              ? mainErrors.oneSentence.msg
              : "",
            price: mainErrors.oneSentence ? mainErrors.oneSentence.msg : "",
            story: mainErrors.story ? mainErrors.story.msg : ""
          };
          _this.setState({
            error: err_msg,
            success: ""
          });
        } else {
          _this.setState({
            data: {
              title: "",
              keywords: "",
              oneSentence: "",
              story: ""
            },
            error: {
              title: "",
              keywords: "",
              oneSentence: "",
              story: ""
            },
            success: "Thank you for posting item"
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Link className="btn btn-success" to={"/"}>
          Home Page
        </Link>
        <br />
        <h1>Create a new listing</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputname" />
            <input
              type="text"
              name="title"
              value={this.state.data.title}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputname"
              placeholder="Title of your Article"
            />
            <p className="text-danger">{this.state.error.title}</p>
          </div>

          <div className="form-group">
            <label htmlFor="exampleInputEmail1" />
            <input
              type="text"
              name="keywords"
              value={this.state.data.keywords}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Keywords (seperate by comma)"
            />
            <p className="text-danger">{this.state.error.keywords}</p>
          </div>

          <div className="form-group">
            <label htmlFor="exampleInputEmail1" />
            <input
              type="text"
              name="oneSentence"
              value={this.state.data.oneSentence}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputDesc"
              aria-describedby="descHelp"
              placeholder="oneSentence summary of your article"
            />
            <p className="text-danger">{this.state.error.oneSentence}</p>
          </div>

          <div className="form-group">
            <label htmlFor="exampleInputPassword1" />
            <textarea
              name="story"
              value={this.state.data.story}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="tell your story"
            />
            <p className="text-danger">{this.state.error.story}</p>
          </div>

          <button type="submit" className="btn btn-primary">
            Post your Tech Talk
          </button>
        </form>
        {this.state.success === "" ? (
          <p />
        ) : (
          <p className="text-success">{this.state.success}</p>
        )}
        <br />
        <br />
      </div>
    );
  }
}
