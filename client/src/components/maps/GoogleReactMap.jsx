import React, { useState, useEffect, useRef } from "react";
import mapStyles from "./mapStyles";
import Map from "./Map.jsx";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import api from "../../api";

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
            lat: Number(specificPlace.geometry.location.lat()),
            lng: Number(specificPlace.geometry.location.lng())
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

  function getCurrentLocation() {
    // console.log("here", window.navigator.geolocation);
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(function(position) {
        const lat = Number(position.coords.latitude);
        const lng = Number(position.coords.longitude);
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
        highVoteId={props.highVoteId}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GKEY}`}
        loadingElement={<div style={{ height: window.innerHeight }} />}
        containerElement={<div style={{ height: window.innerHeight }} />}
        mapElement={<div style={{ height: window.innerHeight }} />}
      />
    </div>
  );
}

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
