import React, { useState, useEffect } from "react";
import mapStyles from "./mapStyles";
import { GoogleMap, Marker, InfoWindow } from "react-google-maps";
import api from "../../api";

const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

export default function Map(props) {
  // the departure on which is clicked will display extra information
  let zoomLocLat;
  let zoomLocLng;
  if (props.currentUserDeparture) {
    zoomLocLat = Number(props.currentUserDeparture.location.coordinates[0]);
    zoomLocLng = Number(props.currentUserDeparture.location.coordinates[1]);
  } else {
    const { lat, lng } = calculateAveragePosition(props.AllNonUserDepartures);
    zoomLocLat = Number(lat);
    zoomLocLng = Number(lng);
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
    return { lat: Number(avgLat), lng: Number(avgLng) };
  }

  const [selectedLocation, setSelectedLocation] = useState(null);
  const googlemapOptions = {
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: false,
    styles: mapStyles
  };

  function onSelectionInfoDisplay(selectedLoc, location_id, isAdmin) {
    console.log("selected loc", selectedLoc);
    return (
      <div>
        {selectedLoc.type_of_location == "departure" && (
          <span className="information-disp">
            departure of {selectedLoc.created_by.first_name}{" "}
            {selectedLoc.created_by.last_name}{" "}
            <img
              src={selectedLoc.created_by.avatar}
              alt="user-avatar"
              className="profile-image"
            />
          </span>
        )}
        {selectedLoc.type_of_location != "departure" && (
          <div>
            <span className="information-disp">
              suggestion from {selectedLoc.created_by.first_name}{" "}
              {selectedLoc.created_by.last_name}{" "}
              <img
                src={selectedLoc.created_by.avatar}
                alt="user-avatar"
                className="profile-image"
              />
            </span>
            <div className="extra-suggestion-info">
              <div>{reformatTypeOf(selectedLoc.type_of_location)}</div>
            </div>

            <button
              className="letsgo-btn"
              id={location_id}
              onClick={handleVote}
            >
              let's go!<span id={location_id}> </span>
              <i className="fas fa-vote-yea" id={location_id}></i>
            </button>
          </div>
        )}
        {/* <pre>{JSON.stringify(selectedLoc, null, 2)}</pre> */}
      </div>
    );
  }

  const UserMarker = (userSugOrDep, suggestordepart) => {
    let iconToUse;
    let amountOfVotes = userSugOrDep.votes.length;
    console.log(userSugOrDep);
    if (props.highVoteId == userSugOrDep._id) {
      iconToUse = picked_suggestion_marker;
    } else if (suggestordepart == "departure") {
      console.log("here");
      iconToUse = user_departure_marker;
    } else {
      console.log("here 2");
      iconToUse = user_suggestion_marker;
    }
    return (
      <Marker
        id={userSugOrDep._id}
        votes={amountOfVotes}
        icon={{
          url: iconToUse,
          scaledSize: new window.google.maps.Size(50, 50)
        }}
        type_of={userSugOrDep.type_of_location}
        position={{
          lat: Number(userSugOrDep.location.coordinates[0]),
          lng: Number(userSugOrDep.location.coordinates[1])
        }}
        // defaultLabel={userSuggestion.created_by.first_name.substr(0, 1)}
        onClick={() => {
          setSelectedLocation(userSugOrDep);
        }}
        // id={userSuggestion._id}
        creator={`${userSugOrDep.created_by.first_name} ${userSugOrDep.created_by.last_name}`}
      ></Marker>
    );
  };

  const nonUserSuggestionMarkers = (
    AllNonUserSuggestions,
    setSelectedLocation
  ) => {
    let markerArray = [];
    AllNonUserSuggestions.forEach((suggestion, i) => {
      var amountOfVotes = suggestion.votes.length;
      var icontoDisplay;
      if (props.highVoteId == suggestion._id) {
        icontoDisplay = picked_suggestion_marker;
      } else {
        icontoDisplay = nonuser_suggestion_marker;
      }
      markerArray.push(
        <Marker
          votes={amountOfVotes}
          icon={{
            url: icontoDisplay,
            scaledSize: new window.google.maps.Size(50, 50)
          }}
          type_of={suggestion.type_of_location}
          key={i}
          position={{
            lat: Number(suggestion.location.coordinates[0]),
            lng: Number(suggestion.location.coordinates[1])
          }}
          onClick={() => {
            setSelectedLocation(suggestion);
          }}
          id={suggestion._id}
          creator={`${suggestion.created_by.first_name} ${suggestion.created_by.last_name}`}
        ></Marker>
      );
    });
    return markerArray;
  };

  const nonUserDepartureMarkers = (
    AllNonUserDepartures,
    setSelectedLocation
  ) => {
    let markerArray = [];
    AllNonUserDepartures.forEach((departure, i) => {
      markerArray.push(
        <Marker
          icon={{
            url: nonuser_departure_marker,
            scaledSize: new window.google.maps.Size(50, 50)
          }}
          type_of={departure.type_of_location}
          key={i}
          position={{
            lat: Number(departure.location.coordinates[0]),
            lng: Number(departure.location.coordinates[1])
          }}
          defaultLabel={departure.created_by.first_name.substr(0, 1)}
          onClick={() => {
            setSelectedLocation(departure);
          }}
          id={departure._id}
          creator={`${departure.created_by.first_name} ${departure.created_by.last_name}`}
        ></Marker>
      );
    });
    return markerArray;
  };

  function handleVote(e) {
    console.log(e, "h");
    console.log(e.target, "d");
    console.log(e.target.id, "d");
    api
      .addVote(e.target.id)
      .then(res => {
        console.log(res.msg);
      })
      .catch(err => console.log("error adding vote"));
  }

  return (
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={15}
      defaultCenter={{ lat: zoomLocLat, lng: zoomLocLng }}
      defaultOptions={{ styles: mapStyles }}
      options={googlemapOptions}
      onBoundsChanged={props.onBoundsChanged}
      onDragStart={() => {
        setSelectedLocation(null);
      }}
    >
      <pre className="markers">
        {props.AllNonUserSuggestions &&
          nonUserSuggestionMarkers(
            props.AllNonUserSuggestions,
            setSelectedLocation
          )}
        {props.AllNonUserDepartures &&
          nonUserDepartureMarkers(
            props.AllNonUserDepartures,
            setSelectedLocation
          )}
        {props.currentUserDeparture &&
          UserMarker(props.currentUserDeparture, "departure")}
        {props.currentUserSuggestion &&
          UserMarker(props.currentUserSuggestion, "suggestion")}
        {selectedLocation && (
          <div>
            <InfoWindow
              position={{
                lat: Number(selectedLocation.location.coordinates[0]),
                lng: Number(selectedLocation.location.coordinates[1])
              }}
              onCloseClick={() => {
                setSelectedLocation(null);
              }}
            >
              {onSelectionInfoDisplay(
                selectedLocation,
                selectedLocation._id,
                props.isAdmin
              )}
            </InfoWindow>
          </div>
        )}
        {props.newSuggestions.map((marker, i) => {
          return (
            <Marker
              // this changes the state defined in Meetup.jsx
              onClick={e => {
                props.setUserSuggestionsDepartures({
                  ...props.userSuggestionsDepartures,
                  suggestion: {
                    name: marker.name,
                    types: marker.types,
                    position: marker.position,
                    rating: marker.rating
                  }
                });
                props.handleNewSuggestionClick(e, marker.name);
              }}
              defaultTitle={marker.name}
              icon={{
                url: `${marker.icon}`,
                scaledSize: new window.google.maps.Size(50, 50)
              }}
              key={i}
              position={marker.position}
              animation={window.google.maps.Animation.DROP}
            />
          );
        })}
        {props.newDepartures.map((marker, i) => {
          return (
            <Marker
              // this changes the state defined in Meetup.jsx
              onClick={e => {
                props.setUserSuggestionsDepartures({
                  ...props.userSuggestionsDepartures,
                  departure: {
                    name: marker.name,
                    types: marker.types,
                    position: marker.position,
                    rating: marker.rating
                  }
                });
                props.handleNewSuggestionClick(e, marker.name);
              }}
              defaultTitle={marker.name}
              icon={{
                url: `${marker.icon}`,
                scaledSize: new window.google.maps.Size(50, 50)
              }}
              key={i}
              position={marker.position}
              animation={window.google.maps.Animation.DROP}
            />
          );
        })}

        <SearchBox
          className="departure-searchbox"
          ref={props.onSearchBoxMountedTwo}
          controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
          bounds={props.bounds}
          // listen for the event when the user selects a query
          onPlacesChanged={props.onPlacesChangedTwo}
        >
          <input
            placeholder="Departure"
            type="text"
            className="departure-input"
          />
        </SearchBox>

        <SearchBox
          className="suggestion-searchbox"
          ref={props.onSearchBoxMounted}
          controlPosition={window.google.maps.ControlPosition.TOP_RIGHT}
          bounds={props.bounds}
          // listen for the event when the user selects
          // a prediction
          onPlacesChanged={props.onPlacesChanged}
        >
          <input
            placeholder="Suggestion"
            type="text"
            className="suggestion-input"
          />
        </SearchBox>
      </pre>
      {/* <pre>{JSON.stringify(center, 2, null)}</pre> */}
      {/* <pre>{JSON.stringify(selectedLocation, null, 2)}</pre> */}
    </GoogleMap>
  );
}

// elements that dont do anything about a state

function reformatTypeOf(typeofsug) {
  const sugtype = typeofsug.replace(",", " ");
  return sugtype;
}
