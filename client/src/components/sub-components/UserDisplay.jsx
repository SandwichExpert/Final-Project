import React, { useState } from "react";
import FriendDisplay from "./FriendDisplay";
import { Link } from "react-router-dom";
import moment from "moment";
import api from '../../api';
import MeetupTable from './MeetupTable';


export default function UserDisplay(props) {
  console.log(props.meetups);
  
  const [editMeetup, setEditMeetup] = useState("");
  const [state, setState] = useState({
    name:"",
    meetup_date:"",
    meetup_time:""
  });

  

  function handleEditClick(e) {
    console.log(e.target._data);
    const meetupId = e.target._data;
    setEditMeetup(meetupId);
  }

  // function handleInputChange(e){
  //   const name=e.target.name;
  //   const value = e.target.value;
  //   setState({...state, [name]:value});
  // }

  // function editMeetupAndRemoveTheLine(e){
  //   e.preventDefault()
  //   const editData ={
  //     name:state.name,
  //     meetup_date:state.meetup_date,
  //     meetup_time:state.meetup_time
  //   }
  //   api
  //     .editMeetup(editData)
  //     .then(editedMeetup => {
  //       props.history.push('/home')
  //     })
      
  // }

  return (
    <div className="user-display">
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${props.user.background_image})`,
          width: "100%"
        }}
      ></div>
      <div className="info-container">
        <div className="circular-image">
          <img className="profile-image" src={props.user.avatar}></img>
          <Link to="/edit-user">Edit profile</Link>
        </div>
        <div className="name-loc-container">
          <h1 className="username">Hi {props.user.first_name}</h1>
          <p className="location">
            <i className="fas fa-map-marker-alt"></i>
            {props.user.city}
          </p>
        </div>
      </div>
      <div className="buttons">
        <button className="buttons__meetup">
          <Link to="/joinmeetup">
            <b>Join Meetup</b>
          </Link>
        </button>
        <button className="buttons__meetup">
          <Link to="/createmeetup">
            <b>Create Meetup</b>
          </Link>
        </button>
      </div>
      <hr></hr>
      {/* <FriendDisplay followers={user.commonFollowers} /> */}
      <FriendDisplay
        friends={props.friends}
        count={props.count}
      ></FriendDisplay>

      <MeetupTable meetups={props.meetups} user={props.user}>
        
      </MeetupTable>
      {/* <div>{JSON.stringify(props.meetups)}</div> */}
    </div>
  );
}
