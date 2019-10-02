import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import GoogleReactMap from "../maps/GoogleReactMap";
import UserDisplay from "../sub-components/UserDisplay";
import moment from "moment";
import LocationSearchBox from "../maps/LocationSearchBox";
// import Logo from '../../assets/maptee_logo.svg'

export default function Meetup(props) {
  // this state is used to store a user
  // a users specific suggestion and dep
  // locations for the specific meetup
  const meetupId = props.match.params.meetupId;
  const [meetup, setMeetup] = useState(null);
  const [user, setUser] = useState("");
  const [allNonUserDepartures, setAllNonUserDepartures] = useState(null);
  const [allNonUserSuggestions, setAllNonUserSuggestions] = useState(null);
  const [state, setState] = useState({
    oldDeparture: null,
    oldSuggestion: null,
    suggestion: null,
    departure: null
  });
  // in the use effect we get all info on the meetup
  // out of that info we want to extract the Departure
  // and suggestion info of thi suser
  useEffect(() => {
    api
      .getUserInfo()
      .then(userInfo => {
        setUser(userInfo);
        const userid = userInfo._id;
        api
          .getMeetUp(meetupId)
          .then(meetup => {
            setMeetup(meetup);
            console.log("DEBUG", meetup);
            const suggestions = meetup._suggested_locations;
            const departures = meetup._departure_locations;
            const {
              userSuggestion,
              userDeparture
            } = getUserSuggestionAndDeparture(userid, suggestions, departures);
            console.log(
              userSuggestion,
              userDeparture,
              "DEBUG user suggestion and departure"
            );
            setState({
              ...state,
              oldSuggestion: userSuggestion,
              oldDeparture: userDeparture
            });
            const {
              nonUserSuggestions,
              nonUserDepartures
            } = getNonUserSuggestionAndDeparture(
              userid,
              suggestions,
              departures
            );
            setAllNonUserDepartures(nonUserDepartures);
            setAllNonUserSuggestions(nonUserSuggestions);
          })
          .catch(err => {
            console.log(err, "error getting meetup");
          });
      })
      .catch(err => {
        console.log(err, "error getting user info");
      });
  }, []);

  function dateDisplay(dateString) {
    const date = moment(dateString).format("MMM DD");
    return date;
  }

  function handleSubmitClick(e) {
    let suggestion = null;
    let departure = null;
    if (state.suggestion) suggestion = state.suggestion;
    if (state.departure) departure = state.departure;
    submitNewDepartureAndSuggestion(suggestion, departure)
      .then()
      .catch();
    props.history.push(`/home`);
  }

  async function submitNewDepartureAndSuggestion(suggestion, departure) {
    let createdSuggestion;
    let createdDeparture;
    if (suggestion) {
      const infoforSuggestion = { ...state.suggestion, meetupid: meetupId };
      createdSuggestion = await api.addSuggestion(infoforSuggestion);
    }
    if (departure) {
      const infoforDeparture = { ...state.departure, meetupid: meetupId };
      createdDeparture = await api.addDeparture(infoforDeparture);
    }
    console.log("hhhhh", createdDeparture, createdSuggestion, state);
    if (departure && suggestion) {
      setState({
        oldDeparture: createdDeparture,
        oldSuggestion: createdSuggestion,
        suggestion: null,
        departure: null
      });
    } else if (departure) {
      setState({ ...state, oldDeparture: createdDeparture, departure: null });
    } else if (suggestion) {
      setState({
        ...state,
        oldSuggestion: createdSuggestion,
        suggestion: null
      });
    }
  }

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
        userSuggestionsDepartures={state}
        setUserSuggestionsDepartures={setState}
        AllNonUserDepartures={allNonUserDepartures}
        AllNonUserSuggestions={allNonUserSuggestions}
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
          <Link to={"/home/"+user._id}>{user.first_name}</Link>
        </div>
      </div>
      {(state.suggestion || state.departure) && (
        <div className="suggestion-departure-wrapper">
          <div className="button-suggestion-departure-display">
            {state.suggestion && (
              <div className="newSuggestion">
                <span>
                  <i className="fas fa-bullseye"></i>
                  suggestion: {state.suggestion.name}
                </span>
              </div>
            )}
            {state.departure && (
              <span className="newDeparture">
                <i className="fas fa-bullseye"></i>
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
                onClick={handleSubmitClick}
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
      {/* <pre>{JSON.stringify(state, null, 2)}</pre>
      <pre>{JSON.stringify(allNonUserDepartures, null, 2)}</pre>
      <pre>{JSON.stringify(allNonUserSuggestions, null, 2)}</pre> */}
    </div>
  );
}

function getUserSuggestionAndDeparture(userId, suggestions, departures) {
  let userSuggestion = null;
  let userDeparture = null;
  suggestions.forEach(suggestion => {
    if (suggestion.created_by._id === userId) {
      userSuggestion = suggestion;
      return;
    }
  });
  departures.forEach(departure => {
    if (departure.created_by._id === userId) {
      userDeparture = departure;
      return;
    }
  });
  return { userSuggestion, userDeparture };
}

function getNonUserSuggestionAndDeparture(userId, suggestions, departures) {
  const nonUserSuggestions = suggestions.filter(
    suggestion => suggestion.created_by._id !== userId
  );
  const nonUserDepartures = departures.filter(
    departure => departure.created_by._id !== userId
  );
  return { nonUserSuggestions, nonUserDepartures };
}
