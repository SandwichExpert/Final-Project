import GoogleReactMap from "../maps/GoogleReactMap";
import TestComponent from "../sub-components/TestComponent";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import api from "../../api";
import ChatBox from "../sub-components/ChatBox";
import Store from "../sub-components/Store";
import Button from "@material-ui/core/Button";
// setup socket.io on the client side
const io = require("socket.io-client");
const socket = io("/");

// this setup has to match your backend
// const socket = io("http://localhost:2000/");
const style = {
  margin: 0,
  top: "auto",
  right: "5%",
  bottom: "5%",
  left: "auto",
  position: "fixed",
  backgroundColor: "#6b7db3",
  color: "#FFFFFF",
  height: 50,
  width: 50,
  borderRadius : 50,
};

export default function Meetup(props) {
  const meetupId = props.match.params.meetupId;
  const [meetup, setMeetup] = useState(null);
  const [user, setUser] = useState("");
  const [markerRefresh, setMarkerRefresh] = useState(false);
  const [allNonUserDepartures, setAllNonUserDepartures] = useState([]);
  const [allNonUserSuggestions, setAllNonUserSuggestions] = useState([]);
  const [highVoteId, setHighVoteId] = useState("");
  const [voteRanking, setVoteRanking] = useState([]);
  const [displayVote, setDisplayVote] = useState(false);
  const [showlegend, setShowlegend] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [state, setState] = useState({
    oldDeparture: null,
    oldSuggestion: null,
    suggestion: null,
    departure: null
  });
  const [isChatActive, setIsChatActive] = useState(false);
  // location states used to determine map zoom
  const [zoomLocation, setZoomLocation] = useState(null);
  const [currentUserPostion, setCurrentUserPosition] = useState(null);

  // states to have live updates
  const [inRoom, setInRoom] = useState(true);
  const [liveSuggestions, setLiveSuggestions] = useState([]);
  // states used for our socket chat
  // const [messageCount, setMessageCount] = useState(0);
  // for now a user is in a room by default
  // we can change this by adding a button to leave chat
  // const [inRoom, setInRoom] = useState(true);

  // use effect to set up our states used in the map
  useEffect(() => {
    getMeetUpAndUserInfo(meetupId)
      .then(suggestionsAndDeparture => {
        createVotingRankingState(suggestionsAndDeparture.suggestions);
        calculateAveragePosition(suggestionsAndDeparture.departures);
        getCurrentLocation();
      })
      .catch(err => {
        console.log(err, "error setting up initial state");
      });
  }, []);

  // use effect for live map updates
  useEffect(() => {
    // users joins a room which is connected
    if (inRoom) {
      console.log("joining the room");
      socket.emit("room", {
        room: `${meetupId}`
      });
    }

    socket.on("receive suggestion", payload => {
      console.log(payload.username, payload.lat, payload.lng);
      setLiveSuggestions([
        ...liveSuggestions,
        { username: payload.username, lat: payload.lat, lng: payload.lng }
      ]);
    });

    return () => {
      if (inRoom) {
        console.log("leaving the room");
        socket.emit("leave room", {
          room: `${meetupId}`
        });
      }
    };
  });

  function toggleDiv() {
    const { show } = isChatActive;
    setIsChatActive({ show: !show });
  }

  function handleNewSuggestion(lat, lng) {
    console.log("sending a suggestion");
    // because on reception the socket will send this messages to
    // clients that are also in this room
    socket.emit("new suggestion", {
      room: `${meetupId}`,
      username: `${user.first_name}`,
      userid: user._id,
      lat: lat,
      lng: lng
    });
  }

  // use effect tot enter and leave a room
  // useEffect(() => {
  //   // users join a room which is connected
  //   if (inRoom) {
  //     console.log("joining the room");
  //     socket.emit("room", {
  //       room: `${meetupId}`
  //     });
  //   }
  //   return () => {
  //     if (inRoom) {
  //       console.log("leaving the room");
  //       socket.emit("leave room", {
  //         room: `${meetupId}`
  //       });
  //     }
  //   };
  // });

  // use effect to handle to receive incoming messages
  // useEffect(() => {
  //   socket.on("receive message", payload => {
  //     console.log(payload, "message payload ");
  //     setMessageCount(messageCount + 1);
  //     console.log("previous message count", messageCount);
  //   });
  // });

  async function getMeetUpAndUserInfo(meetupId) {
    const userInfo = await api.getUserInfo();
    setUser(userInfo);
    const userId = userInfo._id;
    const foundMeetup = await api.getMeetUp(meetupId);
    const suggestions = foundMeetup._suggested_locations;
    const departures = foundMeetup._departure_locations;

    setMeetup(foundMeetup);
    console.log("DEBUG", foundMeetup);
    createVotingRankingState(suggestions);
    const { userSuggestion, userDeparture } = getUserSuggestionAndDeparture(
      userId,
      suggestions,
      departures
    );
    const {
      nonUserSuggestions,
      nonUserDepartures
    } = getNonUserSuggestionAndDeparture(userId, suggestions, departures);
    setState({
      ...state,
      oldSuggestion: userSuggestion,
      oldDeparture: userDeparture
    });
    setAllNonUserDepartures(nonUserDepartures);
    setAllNonUserSuggestions(nonUserSuggestions);
    return { suggestions, departures };
  }

  function calculateAveragePosition(departures) {
    let avgLat = 0;
    let avgLng = 0;
    departures.forEach(departure => {
      avgLat += departure.location.coordinates[0];
      avgLng += departure.location.coordinates[1];
    });
    avgLat /= departures.length;
    avgLng /= departures.length;
    setZoomLocation({ lat: Number(avgLat), lng: Number(avgLng) });
  }

  function getCurrentLocation() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(function(position) {
        const lat = Number(position.coords.latitude);
        const lng = Number(position.coords.longitude);
        const pos = { lat, lng };
        setCurrentUserPosition(pos);
      });
    }
    return null;
  }

  function createVotingRankingState(AllSuggestions) {
    let SuggestionArray = [];
    let highestVotesId = null;
    let highestVotes = 0;
    AllSuggestions.forEach(suggestion => {
      console.log("a suggestion", suggestion);
      if (suggestion.votes.length > highestVotes) {
        highestVotes = suggestion.votes.length;
        highestVotesId = suggestion._id;
      }
      let suggestionAdd = {};
      suggestionAdd.name = suggestion.type_of_location;
      suggestionAdd.amount_of_votes = suggestion.votes.length;
      // console.log(suggestionAdd, "suggest add");
      SuggestionArray.push(suggestionAdd);
    });
    // console.log(SuggestionArray, "suggest arr");
    let SuggestionArraySorted = [...SuggestionArray].sort((a, b) => {
      var votesA = a.amount_of_votes;
      var votesB = b.amount_of_votes;
      if (votesA < votesB) return 1;
      if (votesB > votesA) return -1;
    });
    // console.log(SuggestionArraySorted);
    setVoteRanking(SuggestionArraySorted);
    setHighVoteId(highestVotesId);
  }

  function dateDisplay(dateString) {
    const date = moment(dateString).format("MMM DD");
    return date;
  }

  function handleSubmitClick(e) {
    let suggestionNew = {
      location: { coordinates: [null, null] },
      type_of_location: null,
      created_by: {
        first_name: null,
        last_name: null,
        avatar: null,
        _id: null
      },
      meetupid: meetupId,
      votes: []
    };
    let departureNew = {
      location: { coordinates: [null, null] },
      type_of_location: null,
      created_by: {
        first_name: null,
        last_name: null,
        avatar: null,
        _id: null
      },
      meetupid: meetupId,
      votes: []
    };
    if (state.suggestion) {
      suggestionNew.location.coordinates[0] = state.suggestion.position.lat;

      suggestionNew.location.coordinates[1] = state.suggestion.position.lng;
      suggestionNew.type_of_location = `${state.suggestion.name} ${
        state.suggestion.types[0]
      }`;
      suggestionNew.created_by.first_name = user.first_name;
      suggestionNew.created_by.last_name = user.last_name;
      suggestionNew.created_by.avatar = user.avatar;
      suggestionNew.created_by._id = user._id;
      handleNewSuggestion(
        suggestionNew.location.coordinates[0],
        suggestionNew.location.coordinates[1]
      );
    }
    if (state.departure) {
      departureNew.location.coordinates[0] = Number(
        state.departure.position.lat
      );
      departureNew.location.coordinates[1] = Number(
        state.departure.position.lng
      );
      departureNew.type_of_location = "departure";
      departureNew.created_by.first_name = user.first_name;
      departureNew.created_by.last_name = user.last_name;
      departureNew.created_by.avatar = user.avatar;
      departureNew.created_by._id = user._id;
    }
    submitNewDepartureAndSuggestion({
      suggestion: suggestionNew,
      departure: departureNew
    })
      .then(newIds => {
        console.log(newIds, "prororororor");
        console.log("we have a return");
        if (newIds.newSuggestionId && newIds.newDepartureId) {
          console.log("first if ");
          suggestionNew._id = newIds.newSuggestionId;
          departureNew._id = newIds.newDepartureId;
          setState({
            ...state,
            oldSuggestion: suggestionNew,
            suggestion: null,
            oldDeparture: departureNew,
            departure: null
          });
        } else if (newIds.newSuggestionId) {
          console.log("second  if ");
          suggestionNew._id = newIds.newSuggestionId;
          setState({
            ...state,
            oldSuggestion: suggestionNew,
            suggestion: null
          });
        } else if (newIds.newDepartureId) {
          console.log("third  if ");
          departureNew._id = newIds.newDepartureId;
          setState({ ...state, oldDeparture: departureNew, departure: null });
        }
        markerRefresh ? setMarkerRefresh(false) : setMarkerRefresh(true);
      })
      .catch(err => {
        console.log("error setting new departure or suggestion");
      });
  }

  function handleRemoveClick(e) {
    setState({ ...state, suggestion: null, departure: null });
    markerRefresh ? setMarkerRefresh(false) : setMarkerRefresh(true);
  }

  // function handleInRoom() {
  //   inRoom ? setInRoom(false) : setInRoom(true);
  // }

  // function handleNewMessage() {
  //   console.log("sending a message");
  //   // because on reception the socket will send this messages to
  //   // clients that are also in this room
  //   socket.emit("new message", { room: `${meetupId}` });
  //   setMessageCount(messageCount + 1);
  // }

  async function submitNewDepartureAndSuggestion({ suggestion, departure }) {
    let createdSuggestion = null;
    let createdSuggestionId = null;
    let createdDeparture = null;
    let createdDepartureId = null;
    console.log(suggestion, departure, "-------");
    if (suggestion.type_of_location) {
      createdSuggestion = await api.addSuggestion(suggestion);
      createdSuggestionId = createdSuggestion._id;
    }
    if (departure.type_of_location) {
      createdDeparture = await api.addDeparture(departure);
      createdDepartureId = createdDeparture._id;
    }

    return {
      newSuggestionId: createdSuggestionId,
      newDepartureId: createdDepartureId
    };
  }

  if (!meetup) {
    return (
      <div className="mobile_loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  return (
    <div className="map" style={{ width: window.innerWidth }}>
      <GoogleReactMap
        liveSuggestions={liveSuggestions}
        zoomLocation={zoomLocation}
        userSuggestionsDepartures={state}
        setUserSuggestionsDepartures={setState}
        AllNonUserDepartures={allNonUserDepartures}
        AllNonUserSuggestions={allNonUserSuggestions}
        meetupId={meetupId}
        markerRefresh={markerRefresh}
        highVoteId={highVoteId}
        style={{
          zIndex: 0
        }}
      />

      {/* The Whole chatbox interaction */}

      <Store user={user} meetup={meetup}>
        {isChatActive.show && <ChatBox user={user} meetup={meetup} />}
      </Store>
      <Button variant="fab" aria-label="add" style={style} onClick={toggleDiv}>
        <i className="fas fa-comment"></i>
      </Button>

      {/* end of the chat     */}

      <div className="heading_meetup">
        <div className="left_side">
          <h2>{meetup.name}</h2>
          {dateDisplay(meetup.meetup_date)} - {meetup.meetup_time}
        </div>
        <div className="header-buttons-wrapper">
          <button
            className="heading_middle"
            onClick={e => {
              console.log(e);
              showlegend ? setShowlegend(false) : setShowlegend(true);
            }}
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: 0
            }}
          >
            <p className='legend'>show legend</p> 
            <i className="fas fa-map-signs"></i>
          </button>
          <button
            className="heading_middle"
            onClick={e => {
              console.log(e);
              displayVote ? setDisplayVote(false) : setDisplayVote(true);
            }}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <p className='legend'>see ratings</p> 
            <i className="fas fa-poll"></i>
          </button>
        </div>
        <div className="right_side">
          <div
            className="circular-image_meetup"
            style={{ marginTop: 15, paddingTop: 5 }}
          >
            <img
              className="profile-image_meetup"
              src={user.avatar}
              // style={{ height: 50, width: 50 }}
            ></img>
          </div>
          <Link to={"/home/" + user._id}>{user.first_name}</Link>
        </div>
      </div>
      {(state.suggestion || state.departure) && (
        <div className="suggestion-departure-wrapper">
          <div className="button-suggestion-departure-display">
            {state.suggestion && (
              <div className="newSuggestion">
                <span>
                  <i className="fas fa-bullseye"></i>
                  <span> </span>
                  suggestion: {state.suggestion.name}
                </span>
              </div>
            )}
            {state.departure && (
              <span className="newDeparture">
                <i className="fas fa-bullseye"></i>
                <span> </span>
                departure: {state.departure.name}
              </span>
            )}
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
              <button
                className="meetup-clear-btn"
                id="Confirm"
                onClick={handleRemoveClick}
              >
                <b>Remove new</b>
              </button>
            </div>
          </div>
        </div>
      )}
      {displayVote && (
        <ul className="voting-table">
          {voteRanking.slice(0, 3).map((location, i) => {
            return (
              <b>
                <li key={i} className="voting-item">
                  {i == 0 && (
                    <img
                      src="https://image.flaticon.com/icons/svg/625/625394.svg"
                      className="vote-image"
                    ></img>
                  )}
                  {i == 1 && (
                    <img
                      src="https://image.flaticon.com/icons/svg/731/731871.svg"
                      className="vote-image"
                    ></img>
                  )}
                  {i == 2 && (
                    <img
                      src="https://image.flaticon.com/icons/svg/731/731832.svg"
                      className="vote-image"
                    ></img>
                  )}
                  {location.name} likes {location.amount_of_votes}
                </li>
              </b>
            );
          })}
        </ul>
      )}
      {showlegend && (
        <ul className="map-legend">
          <li className="map-legend-item">
            <img
              src="https://res.cloudinary.com/dri8yyakb/image/upload/v1570171958/optimap_icons/nonuser_departure_marker_ea6fxu.svg"
              alt=""
              className="legend-image"
            />
            <b>friends depart from</b>
          </li>
          <li className="map-legend-item">
            <img
              src="https://res.cloudinary.com/dri8yyakb/image/upload/v1570171958/optimap_icons/nonuser_suggestion_marker_mu2axj.svg"
              alt=""
              className="legend-image"
            />
            <b>friends suggest</b>
          </li>
          <li className="map-legend-item">
            <img
              src="https://res.cloudinary.com/dri8yyakb/image/upload/v1570171958/optimap_icons/picked_suggestion_marker_cdxmkq.svg"
              alt=""
              className="legend-image"
            />
            <b>picked suggestion</b>
          </li>
          <li className="map-legend-item">
            <img
              src="https://res.cloudinary.com/dri8yyakb/image/upload/v1570171749/optimap_icons/user_suggestion_marker_kg9ttt.svg"
              alt=""
              className="legend-image"
            />
            <b>you suggest</b>
          </li>
          <li className="map-legend-item">
            <img
              src="https://res.cloudinary.com/dri8yyakb/image/upload/v1570171750/optimap_icons/user_departure_marker_mi73ho.svg"
              alt=""
              className="legend-image"
            />
            <b>you depart from</b>
          </li>
        </ul>
      )}
      {/* {showChat && (
        <TestComponent
          meetupId={meetupId}
          username={user.first_name}
          meetupName={meetup.name}
        ></TestComponent>
      )} */}

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
