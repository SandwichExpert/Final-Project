import React, { useState } from "react";
import api from "../../api";
import DatePicker from "react-datepicker";

export default function CreateMeetup(props) {
  const [state, setState] = useState({
    name: "",
    meetup_date: "",
    meetup_time: ""
  });
  const DateInput = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
    );
  };

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  }

  function addMeetupAdRedirectToMeetupPage() {
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
      <label for="name">Event Name</label>
      <input
        type="text"
        placeholder="Name of the event"
        className="inputs"
        value={state.name}
        onChange={handleInputChange}
        name="name"
      />{" "}
      <br />
      {/* <label for="meetup_date">Date</label>
      <input
        type="date"
        className="inputs"
        value={state.meetup_date}
        onChange={handleInputChange}
        name="meetup_date"
      /> */}
      <DateInput />
      <br />
      <label for="meetup_time">Time</label>
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
      <button className="button" onClick={addMeetupAdRedirectToMeetupPage}>
        <b>Create</b>
      </button>
      <br />
    </div>
  );
}
