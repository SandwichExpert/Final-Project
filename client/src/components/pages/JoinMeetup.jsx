import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function JoinMeetup(props) {
  const [meetup, setMeetup] = useState({
    _id:''
  });
  const [meetups, setMeetups] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    api.getUserInfo().then(userInfo => {
      setUser(userInfo);
    });
  }, []);

  useEffect(() => {
    api.getMeetUp().then(meetups => {
      setMeetups(meetups);
    });
  }, []);


  function handleInputChange(e){
    const name = e.target.name;
    const value = e.target.value;
    setMeetup({...meetup, [name]:value});
  }

  // function findMeetupById(){
  //   let meetup = meetups.filter(meetup=> meetup._id === meetups._id)
  //   return meetup; 
  // }

  const [invalid,setInvalid]=useState(null);

  function handleSubmit(e){
    console.log('here we go')
    e.preventDefault();
    api.
    addUserToMeetup(user._id,meetup._id)
    .then(joinedMeetup =>{
      console.log("successfully joined",meetup,user)
      props.history.push("/home");
      
    })
    .catch(err => setInvalid(err.toString()));
  }

 

  return (
    <div className="mobile-container-creation">
      <div className="close_window">
        <Link to="/home" style={{ color: "white" }}>
          <i className="fas fa-times"></i>
        </Link>
      </div>
      <div className="add_user">
        <b>Input meetup ID:</b><br/>
        <input type="text" value={meetup._id} name="_id" placeHolder="meetup ID" className="inputs"
        onChange={handleInputChange}/>
        <button className="button" onClick={handleSubmit}>
          Submit
        </button>
        {invalid && <div className="info info-danger">{invalid}</div> }
      </div>
    </div>
  );
}
