import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import GoogleReactMap from "../maps/GoogleReactMap";
import UserDisplay from "../sub-components/UserDisplay";
import { userInfo } from "os";
import moment from "moment";
import LocationSearchBox from "../maps/LocationSearchBox";
// import Logo from '../../assets/maptee_logo.svg'

export default function Meetup(props) {
  const [location, setLocation] = useState({
    departure: "",
    suggested_location: "",
    vote: [false]
  });
  const [state, setState] = useState({ suggestion: null });
  const [meetup, setMeetup] = useState(null);
  const meetupId = props.match.params.meetupId;
  const [user, setUser] = useState("");

  function dateDisplay(dateString) {
    const date = moment(dateString).format("MMM DD");
    console.log(date, "--------------*************----------");
    return date;
  }
  console.log(meetupId);

  // function findAdmin(){
  //   return Meetup.findById(hostedBy => hostedBy._id === Meetup._admin)
  // }

  // let administrator = findAdmin()

  console.log(meetupId);

  useEffect(() => {
    api.getMeetUp(meetupId).then(meetup => {
      setMeetup(meetup);
      console.log("DEBUG", meetup);
    });
  }, []);

  useEffect(() => {
    api.getUserInfo().then(userInfo => {
      setUser(userInfo);
      console.log(user);
    });
  }, []);

  if (!meetup) {
    return (
      <div className="mobile_loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  return (
    <div className="map">
      <GoogleReactMap
        inputFormState={state}
        setInputFormState={setState}
        meetupId={meetupId}
        style={{
          zIndex: 0
        }}
      />
      <div className="heading_meetup">
        <div className="left_side">
          <h2>{meetup.name}</h2>
          {dateDisplay(meetup.meetup_date)} - {meetup.meetup_time}
        </div>
        <div className="right_side">
          <div className="circular-image" style={{ marginTop: 5 }}>
            <img
              className="profile-image"
              src={user.avatar}
              style={{ height: 50, width: 50 }}
            ></img>
          </div>
          <Link to="/home">{user.first_name}</Link>
        </div>
      </div>
      <div className="mobile_meetup">
        {state.suggestion && (
          <span>
            current suggestion {state.suggestion.name}{" "}
            {state.suggestion.position.lat}
            {state.suggestion.position.lng}
            and rating {state.suggestion.rating}/5
          </span>
        )}
        <br />
        {/* <Link to="" className="forgotten">Forgotten password?</Link> */}
        {/* <span className="forgotten">Forgotten Password?</span> */}
        <button className="button" id="Confirm">
          <b>Confirm</b>
        </button>
        <br />
      </div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
