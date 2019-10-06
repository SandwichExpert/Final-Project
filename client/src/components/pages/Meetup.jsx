import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import GoogleReactMap from "../maps/GoogleReactMap";
import UserDisplay from "../sub-components/UserDisplay";
import moment from "moment";
import LocationSearchBox from "../maps/LocationSearchBox";
// import Logo from '../../assets/maptee_logo.svg'

export default function Meetup(props) {
  const meetupId = props.match.params.meetupId;
  const [meetup, setMeetup] = useState(null);
  const [user, setUser] = useState("");
  const [markerRefresh, setMarkerRefresh] = useState(false);
  const [allNonUserDepartures, setAllNonUserDepartures] = useState(null);
  const [allNonUserSuggestions, setAllNonUserSuggestions] = useState(null);
  const [voteRanking, setVoteRanking] = useState([]);
  const [displayVote, setDisplayVote] = useState(false);
  const [highVoteId, setHighVoteId] = useState("");
  const [state, setState] = useState({
    oldDeparture: null,
    oldSuggestion: null,
    suggestion: null,
    departure: null
  });
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
            createVotingRankingState(suggestions);
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
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        _id: user._id
      },
      meetupid: meetupId,
      votes: []
    };
    let departureNew = {
      location: { coordinates: [null, null] },
      type_of_location: null,
      created_by: {
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        _id: user._id
      },
      meetupid: meetupId,
      votes: []
    };
    if (state.suggestion) {
      suggestionNew.location.coordinates[0] = state.suggestion.position.lat;

      suggestionNew.location.coordinates[1] = state.suggestion.position.lng;
      suggestionNew.type_of_location = `${state.suggestion.name}`;
    }
    if (state.departure) {
      departureNew.location.coordinates[0] = Number(
        state.departure.position.lat
      );
      departureNew.location.coordinates[1] = Number(
        state.departure.position.lng
      );
      departureNew.type_of_location = "departure";
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
    <div className="map">
      <GoogleReactMap
        userSuggestionsDepartures={state}
        setUserSuggestionsDepartures={setState}
        AllNonUserDepartures={allNonUserDepartures}
        AllNonUserSuggestions={allNonUserSuggestions}
        meetupId={meetupId}
        markerRefresh={markerRefresh}
        highVoteId={highVoteId}
        // voteRanking={voteRanking}
        style={{
          zIndex: 0
        }}
      />
      <div className="heading_meetup">
        <div className="left_side">
          <h2>{meetup.name}</h2>
          {dateDisplay(meetup.meetup_date)} - {meetup.meetup_time}
        </div>
        <div>
          <button
            className="heading_middle"
            onClick={e => {
              console.log(e);
              displayVote ? setDisplayVote(false) : setDisplayVote(true);
            }}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            see ranking <span> </span>
            <i class="fas fa-poll"></i>
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
