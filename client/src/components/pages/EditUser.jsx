import React, { useState, useEffect, setMessage } from "react";
import api from "../../api";
import {Link} from "react-router-dom";
// import { STATES } from 'mongoose';

export default function EditUser(props) {
  const [user, setUser] = useState({
    avatar: null,
    background_image:null,
    first_name: "",
    last_name: "",
    city: ""
  });
  const [state, setState] = useState("");

  useEffect(() => {
    const avatarUrl=user.avatar;
    api.getUserInfo().then(userInfo => {
      setUser(userInfo);
      console.log(userInfo, "----------------------------");
    });
  }, []);

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  }

  function handleFileChange(e) {
    const name = e.target.name;
    const file = e.target.files;
    
    setUser({ ...user, [name]: e.target.files[0] });

    // if(!e.target.files[0]){
    //   setUser({ ...user, [name]: e.target.files[0] });
    // }
    // else {
    //   console.log('here i aaaaaaaaaaaaaaaaaaaaaaam')
    //   setUser({ ...user, [name]: e.target.files[1] })
    // };
   
    
  }

  function handleSubmit(e) {
    console.log("IT'S HAPPENING");
    e.preventDefault();
    let data = {
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
      background_image:user.background_image,
      city : user.city
    };
    api
      .editUser(data)
      .then(updatedUser => {
        console.log("update successfful", user);
        props.history.push("/home");
      })
      .catch(err => setMessage(err.toString()));
  }


  return (
    <div className="mobile-container-creation">
      {/* <div className="mobile-background"> */}
      <div className="close_window">
        <Link to='/home' style={{color:"white"}}><i className="fas fa-times"></i></Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="edit-user">
           {/* <div className="info-container">  */}
             <div className="circular-image">
              <img className="profile-image" src={user.avatar}></img>
            </div> 
        <b>Profile picture</b> <br />{" "}
            <input
              type="file"
              placeholder="Update profile pic"
              className="inputs-edit"
              onChange={handleFileChange}
              name="avatar"
            />{" "}
          {/* </div>  */}
          <b>Background Image</b>
          <input
            type="file"
            placeholder="Update cover picture"
            className="inputs-edit"
            onChange={handleFileChange}
            name="background_image"
          />
          <b>First Name</b>{" "}
          <input
            type="text"
            className="inputs-edit"
            value={user.first_name}
            onChange={handleInputChange}
            name="first_name"
            placeholder={user.first_name}
          />
          <b>Last Name</b>{" "}
          <input
            type="text"
            className="inputs-edit"
            value={user.last_name}
            onChange={handleInputChange}
            name="last_name"
            placeholder={user.last_name}
          />
          <b>City</b>{" "}
          <input
            type="text"
            className="inputs-edit"
            value={user.city}
            onChange={handleInputChange}
            name="city"
            placeholder={user.city}
          />
          <button className="submit-button">
            <b>Edit</b>
          </button>
          {/* <pre>{JSON.stringify(user,null,2)}</pre> */}
        </div>
      </form>
    </div>
  );
}
