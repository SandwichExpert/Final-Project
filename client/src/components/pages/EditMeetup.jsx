import React, { useState, useEffect, setMessage } from "react";
import api from "../../api";
import {Link} from "react-router-dom";
// import { STATES } from 'mongoose';

export default function EditMeetup(props) {
  const [meetup, setMeetup] = useState({
    name: "",
    meetup_time: "",
    meetup_date: "",
  });
  const [state, setState] = useState("");
  

  const meetupId = props.match.params.meetupId
  useEffect(() => {
    api.getMeetUp(meetupId).then(meetupInfo => {
      setMeetup(meetupInfo);
      console.log(meetupInfo, "----------------------------");
    });
  }, []);

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setMeetup({ ...meetup, [name]: value });
  }

  

  function handleSubmit(e) {
    console.log("IT'S HAPPENING");
    e.preventDefault();
    let data = {
      name: meetup.name,
      meetup_time: meetup.meetup_time,
      meetup_date: meetup.meetup_date,
    };
    api
      .editMeetup(meetupId,data)
      .then(updatedMeetup => {
        console.log("update successfful", meetup);
        props.history.push("/home");
      })
      .catch(err => console.log(err));
  }


  return (
    <div className="mobile-container-creation">
      {/* <div className="mobile-background"> */}
      <div className="close_window">
        <Link to='/home' style={{color:"white"}}><i className="fas fa-times"></i></Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="edit-user">
          
          <b>Name</b>{" "}
          <input
            type="text"
            className="inputs-edit"
            value={meetup.name}
            onChange={handleInputChange}
            name="name"
            placeholder={meetup.name}
          />
          <b>Time</b>{" "}
          <input
            type="time"
            className="inputs-edit"
            value={meetup.meetup_time}
            onChange={handleInputChange}
            name="meetup_time"
            placeholder={meetup.meetup_time}
          />
          <b>Date</b>{" "}
          <input
            type="date"
            className="inputs-edit"
            value={meetup.meetup_date}
            onChange={handleInputChange}
            name="meetup_date"
            placeholder={meetup.meetup_date}
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
