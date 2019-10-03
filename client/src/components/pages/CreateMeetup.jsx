import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import DatePicker from "react-datepicker";
import LocationSearchBox from "../maps/LocationSearchBox";
import { Link } from "react-router-dom";
import moment from "moment";

export default function CreateMeetup(props) {
  const [state, setState] = useState({
    name: "",
    meetup_date: "",
    meetup_time: "",
    departure_location: "Paris"
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [useCurrentLocation, setChecked] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const returnedLocation = getCurrentLocation();
    console.log(returnedLocation);
    inputRef.current.focus();
  }, []);

  function handleCheck(e) {
    console.log(e.target);
    useCurrentLocation ? setChecked(false) : setChecked(true);
  }

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
    console.log(state.name, state.meetup_date, state.meetup_time);
  }

  function getCurrentLocation() {
    // console.log("here", window.navigator.geolocation);
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const pos = { lat, lng };
        setCurrentLocation(pos);
      });
    }
    return null;
  }

  function randomName(){
    const names =["Foo","Toto", "Secret Meeting","War Council","Beeeeeeeer","BEARS","Fight Club","Jedi Council","Incontro","PIZZA","Beets","Battlestar Galactica","Undefined","JarJar Binks","Nickleback", "Henri"];
    const name = names[Math.floor(names.length * Math.random())]
    return name;
  }

  function addMeetupAndRedirectToMeetupPage(e) {
    e.preventDefault();
    const uploadData = {
      name: state.name,
      meetup_date: state.meetup_date,
      meetup_time: state.meetup_time
    };
    // if use current location is checked this location will be used
    // as a departure location
    if (useCurrentLocation) {
      uploadData.departure_location = currentLocation;
    } else {
      // give the lat and long of the searched place as uploaddata
      console.log("---", state.departure_location);
      const coordinates = {
        lat: state.departure_location.geometry.location.lat(),
        lng: state.departure_location.geometry.location.lng()
      };
      console.log("---", coordinates);
      uploadData.departure_location = coordinates;
    }
    console.log(uploadData, "-------------");
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
    <div
      className="mobile-container-creation"
      style={{ height: window.innerHeight }}
    >
      <div className="close_window">
        <Link to="/home" style={{ color: "white" }}>
          <i className="fas fa-times"></i>
        </Link>
      </div>
      {/* <div className="mobile-background"> */}
      <div>
        <label name="name" className="creation-label">
          Event Name
        </label>
        <br />
        <input
          required
          type="text"
          placeholder={randomName()}
          className="inputs-login"
          value={state.name}
          onChange={handleInputChange}
          name="name"
          ref={inputRef}
        />
        <br />
        <label className="creation-label" name="meetup_date">
          Date
        </label>
        <br />
        <input
          required
          type="date"
          className="inputs-login"
          value={state.meetup_date}
          onChange={handleInputChange}
          placeholder={moment}
          name="meetup_date"
        />
        {/* <DateInput /> */}
        <br />
        <label className="creation-label" name="meetup_time">
          Time
        </label>
        <br />
        <input
          required
          type="time"
          className="inputs-login"
          value={state.meetup_time}
          onChange={handleInputChange}
          name="meetup_time"
          style={{ marginBottom: "1rem" }}
        />
        <br />
        {/* <label className="creation-label" name="departure_location">
          Leaving from?
        </label> */}
        <br />
        <LocationSearchBox
          suggestion={false}
          setInputFormState={setState}
          inputFormState={state}
        ></LocationSearchBox>
        <div className="current-location-wrapper" onClick={handleCheck}>
          <span style={{ fontSize: "0.6rem" }}>
            or click here to use current location as departure
          </span>
          {useCurrentLocation && (
            <i class="fas fa-compass" onClick={handleCheck}></i>
          )}
          {!useCurrentLocation && (
            <i class="far fa-compass" onClick={handleCheck}></i>
          )}
        </div>
        <button className="button" onClick={addMeetupAndRedirectToMeetupPage}>
          <b>Create</b>
        </button>
        {/* <pre>{JSON.stringify(state,null,2)}</pre> */}
      </div>
      <br />
      {/* <pre>{JSON.stringify(state, null, 2)}</pre>
      <pre>{JSON.stringify(useCurrentLocation, null, 2)}</pre>
      <pre>{JSON.stringify(currentLocation, null, 2)}</pre> */}
    </div>
  );
}
