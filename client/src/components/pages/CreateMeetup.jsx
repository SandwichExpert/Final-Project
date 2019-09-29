import React, { useState } from "react";
import api from "../../api";

export default function CreateMeetup(props) {
  const [state, setState] = useState({
    name: "",
    meetup_date: "",
    meetup_time: ""
  });

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  }

  function addMeetupAndRedirectToMeetupPage() {
    const uploadData = new FormData();
    uploadData.append("name", state.name);
    uploadData.append("meetup_date", state.meetup_date);
    uploadData.append("meetup_time", state.meetup_time);

    api
      .addMeetUp(uploadData)
      .then(createdMeetUp => {
        props.history.push(`/home`);
      })
      .catch(err => {
        console.log("error adding meetup");
      });
  }

  return (
    <div className="mobile-container-creation">
      {/* <div className="mobile-background"> */}
      <b>Event Name</b> <br />{" "}
      <input
        type="text"
        placeholder="Name of the event"
        className="inputs"
        value={state.name}
        onChange={handleInputChange}
        name="name"
      />{" "}
      <br />
      <b>Date</b> <br />{" "}
      <input
        type="date"
        className="inputs"
        value={state.meetup_date}
        onChange={handleInputChange}
        name="meetup_date"
      />
      <br />
      <b>Time</b> <br />{" "}
      <input
        type="time"
        className="inputs"
        value={state.meetup_time}
        onChange={handleInputChange}
        name="meetup_time"
      />
      <br />
      {/* <Link to="" className="forgotten">Forgotten password?</Link> */}
      {/* <span className="forgotten">Forgotten Password?</span> */}
      <button className="button" onClick={addMeetupAndRedirectToMeetupPage}>
        <b>Create</b>
      </button>
      <br />
    </div>
  );
}
