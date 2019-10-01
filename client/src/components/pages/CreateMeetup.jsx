import React, { useState, useEffect } from "react";
import api from "../../api";
import DatePicker from "react-datepicker";
import LocationSearchBox from "../maps/LocationSearchBox";
import { Link } from "react-router-dom";

export default function CreateMeetup(props) {
  const [state, setState] = useState({
    name: "",
    meetup_date: "",
    meetup_time: "",
    departure_location: "Paris"
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [useCurrentLocation, setChecked] = useState(false);
  // const DateInput = () => {
  //   const [startDate, setStartDate] = useState(new Date());
  //   return (
  //     <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
  //   );
  // };
  useEffect(() => {
    const returnedLocation = getCurrentLocation();
    console.log(returnedLocation);

    // setState({
    //   ...state,
    //   departure_location: {
    //     lat: returnedLocation.lat,
    //     lng: returnedLocation.lng
    //   }
    // });
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
          <i class="fas fa-times"></i>
        </Link>
      </div>
      {/* <div className="mobile-background"> */}
      <form onSubmit={addMeetupAndRedirectToMeetupPage}>
        <label name="name" className="creation-label">
          Event Name
        </label>
        <br />
        <input
          required
          type="text"
          placeholder="What do we call your meetup?"
          className="inputs"
          value={state.name}
          onChange={handleInputChange}
          name="name"
        />
        <br />
        <label className="creation-label" name="meetup_date">
          Date
        </label>
        <br />
        <input
          required
          type="date"
          className="inputs"
          value={state.meetup_date}
          onChange={handleInputChange}
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
          className="inputs"
          value={state.meetup_time}
          onChange={handleInputChange}
          name="meetup_time"
          style={{ marginBottom: "1rem" }}
        />
        <br />
        {/* <label className="creation-label" name="departure_location">
          Leaving from?
        </label> */}
        <LocationSearchBox
          suggestion={false}
          setInputFormState={setState}
          inputFormState={state}
        ></LocationSearchBox>
        <section title=".squaredFour">
          <div class="squaredFour">
            <label for="usecurrent">current location</label>
            <input
              type="checkbox"
              id="squaredFour"
              name="usecurrent"
              onChange={handleCheck}
            />
          </div>
        </section>
        <button className="button">
          <b>Create</b>
        </button>
        {/* <pre>{JSON.stringify(state,null,2)}</pre> */}
      </form>
      <br />
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <pre>{JSON.stringify(useCurrentLocation, null, 2)}</pre>
      <pre>{JSON.stringify(currentLocation, null, 2)}</pre>
    </div>
  );
}
