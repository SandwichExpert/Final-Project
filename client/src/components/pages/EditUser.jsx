import React, { useState, useEffect, setState, setMessage } from 'react';
import api from "../../api";
// import { STATES } from 'mongoose';

export default function EditUser(props){
  const [user,setUser] = useState({
    avatar : null,
    first_name:"",
    last_name:"",
    location:""
  });
  const [state, setState] = useState("");

  useEffect(() =>{
    api.getUserInfo().then(userInfo =>{
      setUser(userInfo);
      console.log(userInfo,"----------------------------")
    });
  },[]);

  function handleInputChange(e){
    const name =e.target.name;
    const value = e.target.value;
    setUser({...user, [name]:value});
  }

  function handleFileChange(e){
    setUser({...user,
      avatar:e.target.files[0]
    })
  }

  function handleSubmit(e){
    console.log("IT'S HAPPENING")
    e.preventDefault()
    let data ={
        first_name : user.first_name,
        last_name : user.last_name,
        avatar : user.avatar
    }
    api.editUser(data)
    .then(updatedUser => {
      console.log('update successfful',user)
      props.history.push('/home')
    })
    .catch(err => setMessage(err.toString()))
  }

  return(
      <div className="mobile-container-creation">
      {/* <div className="mobile-background"> */}
      <form onSubmit={handleSubmit}>
      <b>Profile picture</b> <br />{" "}
      <div className="edit-user">
      <div className="info-container">
        <div className="circular-image">
          <img className="profile-image" src={user.avatar}></img>
        </div>
      <input
        type="file"
        placeholder="Update profile pic"
        className="inputs-edit"
        onChange={handleFileChange}
        name="avatar"
      />{" "}
     </div>
      <b>First Name</b> {" "}
      <input
        type="text"
        className="inputs-edit"
        value={user.first_name}
        onChange={handleInputChange}
        name="first_name"
        placeholder={user.first_name}
      />

      <b>Last Name</b> {" "}
      <input
        type="text"
        className="inputs-edit"
        value={user.last_name}
        onChange={handleInputChange}
        name="last_name"
        placeholder={user.last_name}
      />
      
      <b>Location</b> {" "}
      <input
        type="text"
        className="inputs-edit"
        value={user.location}
        onChange={handleInputChange}
        name="location"
        placeholder={user.location}
      />
      
      <button className="submit-button" >
        <b>Edit</b>
      </button>
      
      </div>
      </form>
      
    </div>
  )
    

}