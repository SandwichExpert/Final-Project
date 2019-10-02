import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import mapStyles from "./mapStyles";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
const {
  MarkerWithLabel
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

function Map(props) {
  // the departure on which is clicked will display extra information
  const [selectedLocation, setSelectedLocation] = useState(null);
  const googlemapOptions = {
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: false
  };

  return (
    <GoogleMap
      // give a ref to the googleMap when it is mounted
      ref={props.onMapMounted}
      defaultZoom={10}
      defaultCenter={props.zoomLocation}
      defaultOptions={{ styles: mapStyles }}
      options={googlemapOptions}
      onBoundsChanged={props.onBoundsChanged}
      // we want our searches to be relevant to the current bounds
    >
      <div className="searchbox-wrapper">
        <SearchBox
          className="departure-searchbox"
          ref={props.onSearchBoxMountedTwo}
          controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}
          bounds={props.bounds}
          // listen for the event when the user selects a query
          onPlacesChanged={props.onPlacesChangedTwo}
        >
          <input
            placeholder="set a new departure"
            type="text"
            className="departure-input"
          />
        </SearchBox>
        <SearchBox
          className="suggestion-searchbox"
          ref={props.onSearchBoxMounted}
          controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}
          bounds={props.bounds}
          // listen for the event when the user selects
          // a prediction
          onPlacesChanged={props.onPlacesChanged}
        >
          <input
            placeholder="make a new suggestion"
            type="text"
            className="suggestion-input"
          />
        </SearchBox>
      </div>
      {props.returnSuggestionMarkers(
        props.suggestedLocations,
        props.handleSuggestionMarkerClick,
        "red",
        setSelectedLocation
      )}
      {props.returnDepartureMarkers(
        props.departureLocations,
        setSelectedLocation,
        "green"
      )}
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
            {departureInfoDisplay(selectedLocation)}
          </InfoWindow>
        </div>
      )}
      {props.newSuggestions.map((marker, i) => {
        return (
          <Marker
            // this changes the state defined in Meetup.jsx
            onClick={e => {
              props.setInputFormState({
                ...props.inputFormState,
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
              props.setInputFormState({
                ...props.inputFormState,
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
      {/* <pre>{JSON.stringify(center, 2, null)}</pre>
      <pre>{JSON.stringify(selectedLocation, 2, null)}</pre> */}
    </GoogleMap>
  );
}

const WrapperMap = withScriptjs(withGoogleMap(Map));

export default function GoogleReactMap(props) {
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 48, lng: 3 });
  const [averagePosition, setAverage] = useState(null);
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [departureLocations, setDepartureLocations] = useState([]);
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
    api
      .getMeetUp(props.meetupId)
      .then(meetup => {
        setSuggestedLocations(meetup._suggested_locations);
        setDepartureLocations(meetup._departure_locations);
        const avgPos = calculateAveragePosition(meetup._departure_locations);
        setAverage(avgPos);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

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

  const onPlacesChanged = () => {
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
      props.setInputFormState({
        ...props.inputFormState,
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
  };

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
      props.setInputFormState({
        ...props.inputFormState,
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

  const returnSuggestionMarkers = (
    locationsArr,
    handleClick,
    color,
    setSelectedLocation
  ) => {
    let markerArray = [];
    locationsArr.forEach((location, i) => {
      markerArray.push(
        <Marker
          icon={{
            url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
            scaledSize: new window.google.maps.Size(30, 30)
          }}
          type_of={location.type_of_location}
          key={i}
          position={{
            lat: location.location.coordinates[0],
            lng: location.location.coordinates[1]
          }}
          defaultLabel={location.created_by.first_name.substr(0, 1)}
          onClick={() => {
            setSelectedLocation(location);
          }}
          id={location._id}
          creator={`${location.created_by.first_name} ${location.created_by.last_name}`}
        ></Marker>
      );
    });
    return markerArray;
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

  function calculateAveragePosition(departures) {
    if (departures.length == 0) {
      return null;
    }
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

  function handleSuggestionMarkerClick(e, name) {
    console.log("----", name);
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    console.log(lat, lng);
    suggestedLocations.forEach(location => {
      console.log(location);
      if (
        location.location.coordinates[0] === lat &&
        location.location.coordinates[1] === lng
      ) {
        console.log("hit of suggestion", location._id);
      }
    });
  }

  function handleDepartureMarkerClick(e) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    departureLocations.forEach(location => {
      if (
        location.location.coordinates[0] === lat &&
        location.location.coordinates[1] === lng
      ) {
        console.log("hit of departure", location._id);
      }
    });
  }

  function handleNewSuggestionClick(e) {
    console.log(e);
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
  }

  function handleMouseOver(e) {}

  if (loading) {
    return <h1>Loading ...</h1>;
  }

  return (
    <div style={{ width: window.innerWidth, height: window.innerHeight }}>
      <WrapperMap
        // these two come from meetup.jsx the higher state
        // lives there
        inputFormState={props.inputFormState}
        setInputFormState={props.setInputFormState}
        suggestedLocations={suggestedLocations}
        departureLocations={departureLocations}
        // the map will zoom in on the average departure location
        // or if not present the user location
        zoomLocation={averagePosition || userLocation}
        returnSuggestionMarkers={returnSuggestionMarkers}
        returnDepartureMarkers={returnDepartureMarkers}
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
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GKEY}`}
        loadingElement={<div style={{ height: window.innerHeight }} />}
        containerElement={<div style={{ height: window.innerHeight }} />}
        mapElement={<div style={{ height: window.innerHeight }} />}
      />
    </div>
  );
}

// elements that dont do anything about a state
function departureInfoDisplay(selectedLoc) {
  return (
    <div>
      <h5>info</h5>
      <ul>
        <li>
          creator: {selectedLoc.created_by.first_name}{" "}
          {selectedLoc.created_by.last_name}
        </li>
        <li>type: {selectedLoc.type_of_location}</li>
      </ul>

      <pre>{JSON.stringify(selectedLoc, null, 2)}</pre>
    </div>
  );
}
