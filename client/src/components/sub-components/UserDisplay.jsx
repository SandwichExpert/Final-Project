import React, { useState } from "react";
import FriendDisplay from "./FriendDisplay";
import { Link } from "react-router-dom";
import moment from "moment";
import api from "../../api";
import MeetupTable from "./MeetupTable";

export default function UserDisplay(props) {
  console.log(props.meetups);

  const [editMeetup, setEditMeetup] = useState("");
  const [state, setState] = useState({
    name: "",
    meetup_date: "",
    meetup_time: ""
  });

  function handleEditClick(e) {
    console.log(e.target._data);
    const meetupId = e.target._data;
    setEditMeetup(meetupId);
  }

  function logout() {
    console.log(props.history);
    api.logout().then(loggedOut => {
      console.log(loggedOut, "logged out successfully");
    });
  }

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
        <div className="user-left">
          <div className="circular-image">
            <img
              className="profile-image"
              src={
                props.user.avatar ||
                "https://www.pnglot.com/pngfile/detail/222-2222829_default-avatar-svg-png-icon-free-download-avatar.png"
              }
            ></img>
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
        <div className="user-right">
          <Link to="/" onClick={logout}>
            Logout
          </Link>
        </div>
      </div>
      <div className="buttons">
        <button className="buttons__meetup">
          <Link to="/join">
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

      <MeetupTable meetups={props.meetups} user={props.user}></MeetupTable>

      {/* <div>{JSON.stringify(props.meetups)}</div> */}
    </div>
  );
}
