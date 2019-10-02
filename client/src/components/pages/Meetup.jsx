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
  const [state, setState] = useState({
    oldDeparture: null,
    oldSuggestion: null,
    suggestion: null,
    departure: null
  });
  const [meetup, setMeetup] = useState(null);
  const meetupId = props.match.params.meetupId;
  const [user, setUser] = useState("");

  function dateDisplay(dateString) {
    const date = moment(dateString).format("MMM DD");
    return date;
  }
  console.log(meetupId);

  function getOldSuggestionAndDeparture(userId, suggestions, departures) {
    let foundsuggestion = null;
    let founddeparture = null;
    suggestions.forEach(suggestion => {
      if (suggestion.created_by._id == userId) {
        foundsuggestion = suggestion;
        foundsuggestion.meetupid = meetupId;
        return;
      }
    });
    departures.forEach(departure => {
      if (departure.created_by._id == userId) {
        founddeparture = departure;
        // add the meetup id for the departure
        founddeparture.meetupid = meetupId;
        return;
      }
    });
    setState({
      ...state,
      oldSuggestion: foundsuggestion,
      oldDeparture: founddeparture
    });
  }

  function handleButtonClick(e) {
    if (state.suggestion) {
      const infoforSuggestion = { ...state.suggestion, meetupid: meetupId };
      api
        .addSuggestion(infoforSuggestion)
        .then(createdSuggestion => {
          setState({
            ...state,
            oldSuggestion: createdSuggestion,
            suggestion: null
          });
        })
        .catch(err => {
          console.log("error changing suggestion", err);
        });
    }
    if (state.departure) {
      console.log("deppepepepe", state.departure);
      const infoforDeparture = { ...state.departure, meetupid: meetupId };
      console.log(infoforDeparture);
      api
        .addDeparture(infoforDeparture)
        .then(createdDeparture => {
          // setState({
          //   ...state,
          //   oldDeparture: createdDeparture,
          //   departure: null
          // });
        })
        .catch(err => {
          console.log("error changing departure", err);
        });
    }
    props.history.push(`/home`);
  }

  useEffect(() => {
    api.getMeetUp(meetupId).then(meetup => {
      setMeetup(meetup);
      const suggestions = meetup._suggested_locations;
      const departures = meetup._departure_locations;
      console.log("DEBUG", meetup);
      api.getUserInfo().then(userInfo => {
        setUser(userInfo);
        const userid = userInfo._id;
        // function to loop through departures and
        // suggestions and check if this user is in it
        getOldSuggestionAndDeparture(userid, suggestions, departures);
      });
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
      {(state.suggestion || state.departure) && (
        <div className="suggestion-departure-wrapper">
          <div className="button-suggestion-departure-display">
            {state.suggestion && (
              <div className="newSuggestion">
                <span>
                  <i class="fas fa-bullseye"></i>
                  suggestion: {state.suggestion.name}
                </span>
              </div>
            )}
            {state.departure && (
              <span className="newDeparture">
                <i class="fas fa-bullseye"></i>
                departure: {state.departure.name}
              </span>
            )}
            <br />
            {/* <Link to="" className="forgotten">Forgotten password?</Link> */}
            {/* <span className="forgotten">Forgotten Password?</span> */}
            <div className="btn-wrapper">
              <button
                className="meetup-submit-btn"
                id="Confirm"
                onClick={handleButtonClick}
              >
                <b>Submit new</b>
              </button>
              <button className="meetup-clear-btn" id="Confirm">
                <b>Remove new</b>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
    </div>
  );
}
