import React, { useState } from "react";
import api from "../../api";
import Logo from "../../assets/maptee_logo.svg";

export default function Signup(props) {
  const [state, setState] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    city:"",
    avatar: ""
  });

  function handleInputChange(event) {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  }

  function handleFileChange(event) {
    console.log("the file added by the user is: ", event.target.files[0]);
    setState({ ...state, avatar: event.target.files[0] });
  }

  function handleClick(e) {
    e.preventDefault();
    let data = {
      email: state.email,
      first_name: state.first_name,
      last_name: state.last_name,
      password: state.password,
      city:state.city,
      avatar: state.avatar
    };
    api
      .signup(data)
      .then(result => {
        console.log("SUCCESS!");
        props.history.push("/home"); // Redirect to the home page
      })
      .catch(err => setState({ message: err.toString() }));
  }
  return (
    <div className="general-container">
    <div className="mobile-container">
      <img src={Logo} alt="Maptee" className="main_logo_signup" />
      <div className="mobile-background_signup">
        <form className="signup_form">
          email <br />
          <input
            type="email"
            value={state.email}
            name="email"
            onChange={handleInputChange}
            className="inputs-login"
            placeholder="Your email address"
          />{" "}
          <br />
          First Name: <br />
          <input
            type="text"
            value={state.first_name}
            name="first_name"
            onChange={handleInputChange}
            className="inputs-login"
            placeholder="Your first name"
          />{" "}
          <br />
          Last Name: <br />
          <input
            type="text"
            value={state.last_name}
            name="last_name"
            onChange={handleInputChange}
            className="inputs-login"
            placeholder="Your last name"
          />{" "}
          <br />
          Password: <br />
          <input
            type="password"
            value={state.password}
            name="password"
            onChange={handleInputChange}
            className="inputs-login"
            placeholder="Your password"
          />{" "}
          <br />
          City: <br />
          <input
            type="text"
            value={state.city}
            name="city"
            onChange={handleInputChange}
            className="inputs-login"
            placeholder="Your city"
          />{" "}
          <br />
          Avatar: <br />
          <input
            type="file"
            // value={state.file}
            name="avatar"
            onChange={handleFileChange}
            className="inputs-edit-file"
          />{" "}
          <br />
          <button onClick={e => handleClick(e)} className="button" id="Signup">
            <b>Signup</b>
          </button>
        </form>
        {state.message && (
          <div className="info info-danger">{state.message}</div>
        )}
      </div>
    </div>
    </div>
  );
}
