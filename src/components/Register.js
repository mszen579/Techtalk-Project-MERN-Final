import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: "",
        email: "",
        desc: "",
        password: "",
        con_password: ""
      },
      error: {
        name: "",
        email: "",
        desc: "",
        password: "",
        con_password: ""
      },
      success: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(element) {
    var formData = this.state.data;
    formData[element.target.name] = element.target.value;
    this.setState({
      data: formData
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    let _this = this;
    axios
      .post("http://localhost:8000/api/register", this.state.data)
      .then(res => {
        console.log("res", res);
        if (res.data.errors) {
          let mainErrors = res.data.errors;
          let err_msg = {
            name: mainErrors.name ? mainErrors.name.msg : "",
            email: mainErrors.email ? mainErrors.email.msg : "",
            desc: mainErrors.desc ? mainErrors.desc.msg : "",
            password: mainErrors.password ? mainErrors.password.msg : "",
            con_password: mainErrors.con_password
              ? mainErrors.con_password.msg
              : ""
          };
          _this.setState({
            error: err_msg,
            success: ""
          });
        } else {
          _this.setState({
            data: {
              name: "",
              email: "",
              desc: "",
              password: "",
              con_password: ""
            },
            error: {
              name: "",
              email: "",
              desc: "",
              password: "",
              con_password: ""
            },
            success: "Thank you for registering"
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
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputname">Full Name</label>
            <input
              type="text"
              name="name"
              value={this.state.data.name}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputname"
              placeholder="Full Name"
            />
            <p className="text-danger">{this.state.error.name}</p>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="text"
              name="email"
              value={this.state.data.email}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
            <p className="text-danger">{this.state.error.email}</p>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Description</label>
            <input
              type="text"
              name="desc"
              value={this.state.data.desc}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputDesc"
              aria-describedby="descHelp"
              placeholder="A short description about you"
            />
            <p className="text-danger">{this.state.error.desc}</p>
          </div>

          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              name="password"
              value={this.state.data.password}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            />
            <p className="text-danger">{this.state.error.password}</p>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputConfirmationPassword">
              Confirm Password
            </label>
            <input
              type="password"
              name="con_password"
              value={this.state.data.con_password}
              onChange={this.handleChange}
              className="form-control"
              id="exampleInputConfirmationPassword"
              placeholder="Confirm Password"
            />
            <p className="text-danger">{this.state.error.con_password}</p>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
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

export default Register;
