import React, { useState } from "react";
import api from "../../api";
import DatePicker from "react-datepicker";
import SearchBox  from "../maps/LocationSearchBox";
import {Link} from "react-router-dom";

export default function CreateMeetup(props) {
  const [state, setState] = useState({
    name: "",
    meetup_date: "",
    meetup_time: "",
    // departure_location: ""
  });
  // const DateInput = () => {
  //   const [startDate, setStartDate] = useState(new Date());
  //   return (
  //     <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
  //   );
  // };

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
    console.log(state.name,state.meetup_date,state.meetup_time)
  }

  function addMeetupAndRedirectToMeetupPage(e) {
    e.preventDefault()
    const uploadData = {
      name:state.name,
      meetup_date:state.meetup_date,
      meetup_time:state.meetup_time
    }
    // new FormData();
    // uploadData.append("name", state.name);
    // uploadData.append("meetup_date", state.meetup_date);
    // uploadData.append("meetup_time", state.meetup_time);
  

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
      <div className="close_window">
        <Link to='/home' style={{color:"white"}}><i className="fas fa-times"></i></Link>
      </div>
      {/* <div className="mobile-background"> */}
      <form onSubmit={addMeetupAndRedirectToMeetupPage}>
      <label name="name">Event Name</label><br/>
      <input
        type="text"
        placeholder="Name of the event"
        className="inputs"
        value={state.name}
        onChange={handleInputChange}
        name="name"
      />{" "}
      <br />
      <label name="meetup_date">Date</label><br/>
      <input
        type="date"
        className="inputs"
        value={state.meetup_date}
        onChange={handleInputChange}
        name="meetup_date"
      />
      {/* <DateInput /> */}
      <br />
      <label name="meetup_time">Time</label><br/>
      <input
        type="time"
        className="inputs"
        value={state.meetup_time}
        onChange={handleInputChange}
        name="meetup_time"
      />
      <br />
      {/* <SearchBox
        ref={props.onSearchBoxMounted}
        onPlacesChanged={props.onPlacesChanged}
        className="inputs"
        value={state.meetup_date.departure_location}
        onChange={handleInputChange}
        name="departure_location"
      >
        />
      </SearchBox> */}
      {/* <Link to="" className="forgotten">Forgotten password?</Link> */}
      {/* <span className="forgotten">Forgotten Password?</span> */}
      <button className="button">
        <b>Create</b>
      </button>
      {/* <pre>{JSON.stringify(state,null,2)}</pre> */}
      </form>
      <br />
    </div>
  );
}


