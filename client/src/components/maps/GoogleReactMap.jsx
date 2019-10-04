// import user_departure_marker from "../../assets/user_departure_marker.svg";
// import user_suggestion_marker from "../../assets/user_suggestion_marker.svg";
// import nonuser_departure_marker from "../../assets/nonuser_departure_marker.svg";
// import nonuser_suggestion_marker from "../../assets/nonuser_suggestion_marker.svg";
// import picked_suggestion_marker from "../../assets/picked_suggestion_marker.svg";
import React, { useState, useEffect, useRef } from "react";
import mapStyles from "./mapStyles";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import api from "../../api";
const nonuser_departure_marker =
  "https://res.cloudinary.com/dri8yyakb/image/upload/v1570171958/optimap_icons/nonuser_departure_marker_ea6fxu.svg";
const nonuser_suggestion_marker =
  "https://res.cloudinary.com/dri8yyakb/image/upload/v1570171958/optimap_icons/nonuser_suggestion_marker_mu2axj.svg";
const picked_suggestion_marker =
  "https://res.cloudinary.com/dri8yyakb/image/upload/v1570171958/optimap_icons/picked_suggestion_marker_cdxmkq.svg";
const user_suggestion_marker =
  "https://res.cloudinary.com/dri8yyakb/image/upload/v1570171749/optimap_icons/user_suggestion_marker_kg9ttt.svg";
const user_departure_marker =
  "https://res.cloudinary.com/dri8yyakb/image/upload/v1570171750/optimap_icons/user_departure_marker_mi73ho.svg";
const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

function Map(props) {
  // the departure on which is clicked will display extra information
  let zoomLocLat;
  let zoomLocLng;
  if (props.currentUserDeparture) {
    zoomLocLat = props.currentUserDeparture.location.coordinates[0];
    zoomLocLng = props.currentUserDeparture.location.coordinates[1];
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
    return { lat: avgLat, lng: avgLng };
  }

  const [selectedLocation, setSelectedLocation] = useState(null);
  const googlemapOptions = {
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: false,
    styles: mapStyles
  };

  function onSelectionInfoDisplay(selectedLoc, location_id, isAdmin) {
    return (
      <div>
        {selectedLoc.type_of_location == "departure" && (
          <span>
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
            <span>
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

            <button id={location_id} onClick={handleVote}>
              let's go!<span id={location_id}> </span>
              <i class="fas fa-vote-yea" id={location_id}></i>
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
    if (userSugOrDep.votes.length > 0) {
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
      if (suggestion.votes) {
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
          icon={nonuser_departure_marker}
          type_of={departure.type_of_location}
          key={i}
          position={{
            lat: departure.location.coordinates[0],
            lng: departure.location.coordinates[1]
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
      // give a ref to the googleMap when it is mounted
      ref={props.onMapMounted}
      defaultZoom={15}
      defaultCenter={{ lat: zoomLocLat, lng: zoomLocLng }}
      defaultOptions={{ styles: mapStyles }}
      options={googlemapOptions}
      onBoundsChanged={props.onBoundsChanged}
      onDragStart={() => {
        setSelectedLocation(null);
      }}
      // we want our searches to be relevant to the current bounds
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
                lat: selectedLocation.location.coordinates[0],
                lng: selectedLocation.location.coordinates[1]
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
                scaledSize: new window.google.maps.Size(16, 16),
                size: new window.google.maps.Size(71, 71),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(17, 34)
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
                scaledSize: new window.google.maps.Size(16, 16),
                size: new window.google.maps.Size(71, 71),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(17, 34)
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
          controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
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

const WrapperMap = withScriptjs(withGoogleMap(Map));

export default function GoogleReactMap(props) {
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 48, lng: 3 });
  const [averagePosition, setAverage] = useState(null);
  const [state, setState] = useState({
    bounds: null,
    newSuggestions: [],
    newDepartures: []
  });
  const refs = {};
  useEffect(() => {
    // upon loading the current departures and suggestions
    // are called upon and set in this state
    getCurrentLocation();
    console.log(props.userSuggestionsDepartures, "hehehehehehebcoeucbeocjbs");
    setLoading(false);
    return () => {
      console.log(refs);
      // refs.searchBox.removeListener("places_changed", onPlacesChanged);
      // refs.searchBoxTwo.removeListener("places_changed", onPlacesChangedTwo);
    };
  }, [props.markerRefresh]);

  useEffect(() => {
    // upon loading the current departures and suggestions
    // are called upon and set in this state
    clearOldMarkers();
  }, [props.markerRefresh]);

  const onSearchBoxMounted = ref => (refs.searchBox = ref);
  const onSearchBoxMountedTwo = ref => (refs.searchBoxTwo = ref);

  const onMapMounted = ref => (refs.map = ref);
  // we are going to update the bounds of the
  // bounds of everytime they change in the map
  // thanks to the ref attached to the map
  // we can do an on bound changes and return it to this wrapper
  const onBoundsChanged = () => {
    setState({ ...state, bounds: refs.map.getBounds() });
    // get bounds returns lat lng bounds LatLngBounds([sw, ne])
  };

  function onPlacesChanged() {
    const places = refs.searchBox.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    // if no places found for the query stop
    if (places.length == 0) {
      return;
    }
    // this is so the state changes if only
    // one place is returned and thus only
    // there is no click necesarry because it is already specific
    if (places.length == 1) {
      const specificPlace = places[0];
      console.log(places, "place object....");
      props.setUserSuggestionsDepartures({
        ...props.userSuggestionsDepartures,
        suggestion: {
          name: specificPlace.name,
          types: specificPlace.types,
          position: {
            lat: specificPlace.geometry.location.lat(),
            lng: specificPlace.geometry.location.lng()
          },
          rating: specificPlace.rating,
          website: specificPlace.website,
          place_id: specificPlace.place_id
        }
      });
    }

    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    const newMarkers = places.map(place => ({
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      icon: place.icon,
      name: place.name,
      types: place.types,
      rating: place.rating
    }));
    setState({ ...state, newSuggestions: newMarkers });
  }

  const onPlacesChangedTwo = () => {
    const places = refs.searchBoxTwo.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    // if no places found for the query stop
    if (places.length == 0) {
      return;
    }
    // this is so the state changes if only
    // one place is returned and thus only
    // there is no click necesarry because it is already specific
    if (places.length == 1) {
      const specificPlace = places[0];
      console.log(places, "place object....");
      props.setUserSuggestionsDepartures({
        ...props.userSuggestionsDepartures,
        departure: {
          name: specificPlace.name,
          types: specificPlace.types,
          position: {
            lat: specificPlace.geometry.location.lat(),
            lng: specificPlace.geometry.location.lng()
          },
          rating: specificPlace.rating,
          website: specificPlace.website,
          place_id: specificPlace.place_id
        }
      });
    }

    // clear all the previous markers
    // setState({...state, markers: null})

    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    const newMarkers = places.map(place => ({
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      icon: place.icon,
      name: place.name,
      types: place.types,
      rating: place.rating
    }));
    setState({ ...state, newDepartures: newMarkers });

    console.log(places, state.markers);
  };

  const returnDepartureMarkers = (locationsArr, setSelectedLocation, color) => {
    let markerArray = [];
    locationsArr.forEach((location, index) => {
      markerArray.push(
        <Marker
          icon={{
            url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
            scaledSize: new window.google.maps.Size(30, 30)
          }}
          type_of={location.type_of_location}
          key={index}
          position={{
            lat: location.location.coordinates[0],
            lng: location.location.coordinates[1]
          }}
          onClick={() => {
            setSelectedLocation(location);
          }}
          id={location._id}
          creator={`${location.created_by.first_name} ${location.created_by.last_name}`}
          // icon={{
          //   url:
          //     "https://res.cloudinary.com/dri8yyakb/image/upload/v1569755342/optimap_icons/pin_fv3znu.png",
          //   scaledSize: new window.google.maps.Size(25, 25)
          // }}
          label={location.created_by.first_name.substr(0, 1)}
          title={location.created_by.first_name}
          // onMouseOver={handleMouseOver}
        ></Marker>
      );
    });
    return markerArray;
  };

  function getCurrentLocation() {
    // console.log("here", window.navigator.geolocation);
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const pos = { lat, lng };
        // console.log(pos, "-----------");
        setUserLocation(pos);
        return pos;
      });
    }
    return null;
  }

  function handleSuggestionMarkerClick(e, name) {
    // console.log("----", name);
    // const lat = e.latLng.lat();
    // const lng = e.latLng.lng();
    // console.log(lat, lng);
    // suggestedLocations.forEach(location => {
    //   console.log(location);
    //   if (
    //     location.location.coordinates[0] === lat &&
    //     location.location.coordinates[1] === lng
    //   ) {
    //     console.log("hit of suggestion", location._id);
    //   }
    // });
  }

  function handleDepartureMarkerClick(e) {
    // const lat = e.latLng.lat();
    // const lng = e.latLng.lng();
    // departureLocations.forEach(location => {
    //   if (
    //     location.location.coordinates[0] === lat &&
    //     location.location.coordinates[1] === lng
    //   ) {
    //     console.log("hit of departure", location._id);
    //   }
    // });
  }

  function handleNewSuggestionClick(e) {
    console.log(e);
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
  }

  function handleMouseOver(e) {}

  function clearOldMarkers() {
    setState({ ...state, newSuggestions: [], newDepartures: [] });
  }

  if (loading) {
    return <h1>Loading ...</h1>;
  }

  return (
    <div style={{ width: window.innerWidth, height: window.innerHeight }}>
      <WrapperMap
        // these two come from meetup.jsx the higher state
        // lives there
        userSuggestionsDepartures={props.userSuggestionsDepartures}
        setUserSuggestionsDepartures={props.setUserSuggestionsDepartures}
        currentUserSuggestion={props.userSuggestionsDepartures.oldSuggestion}
        currentUserDeparture={props.userSuggestionsDepartures.oldDeparture}
        AllNonUserDepartures={props.AllNonUserDepartures}
        AllNonUserSuggestions={props.AllNonUserSuggestions}
        // the map will zoom in on the average departure location
        // or if not present the user location
        zoomLocation={averagePosition || userLocation}
        handleSuggestionMarkerClick={handleSuggestionMarkerClick}
        handleDepartureMarkerClick={handleDepartureMarkerClick}
        handleNewSuggestionClick={handleNewSuggestionClick}
        onMapMounted={onMapMounted}
        onSearchBoxMounted={onSearchBoxMounted}
        onSearchBoxMountedTwo={onSearchBoxMountedTwo}
        onBoundsChanged={onBoundsChanged}
        onPlacesChanged={onPlacesChanged}
        onPlacesChangedTwo={onPlacesChangedTwo}
        newSuggestions={state.newSuggestions}
        newDepartures={state.newDepartures}
        bounds={state.bounds}
        isAdmin={props.isAdmin}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GKEY}`}
        loadingElement={<div style={{ height: window.innerHeight }} />}
        containerElement={<div style={{ height: window.innerHeight }} />}
        mapElement={<div style={{ height: window.innerHeight }} />}
      />
    </div>
  );
}

// elements that dont do anything about a state

function reformatTypeOf(typeofsug) {
  const sugtype = typeofsug.replace(",", " ");
  return sugtype;
}
