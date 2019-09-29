import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import api from "../../api";
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
// const meetupId = props.match.params.meetupId

function Map(props) {
  const [lookupLocation, setLookUpLocation] = useState("");
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [departureLocations, setDepartureLocations] = useState([]);
  const [center, setCenter] = useState({ lat: 50, lng: 50 });
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    api
      .getMeetUp("5d90304f11872b08d0026505")
      .then(meetup => {
        setSuggestedLocations(meetup._suggested_locations);
        setDepartureLocations(meetup._departure_locations);
        getCurrentLocation();
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  // useEffect(() => {}, [zoomInLocation]);
  function getCurrentLocation() {
    console.log("here", window.navigator.geolocation);
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const pos = { lat, lng };
        console.log(pos, "-----------");
        setCenter(pos);
        return pos;
      });
    }
    return null;
  }

  function handleSuggestionMarkerClick(e) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    suggestedLocations.forEach(location => {
      if (
        location.location.coordinates[0] === lat &&
        location.location.coordinates[0] === lng
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
        location.location.coordinates[0] === lng
      ) {
        console.log("hit of departure", location._id);
      }
    });
  }

  if (loading) {
    return <h1>loading ...</h1>;
  }

  return (
    <GoogleMap defaultZoom={3} defaultCenter={center}>
      {returnSuggestionMarkers(suggestedLocations, handleSuggestionMarkerClick)}
      {returnDepartureMarkers(departureLocations, setSelectedLocation)}
      {selectedLocation && (
        <InfoWindow
          position={{
            lat: selectedLocation.location.coordinates[0],
            lng: selectedLocation.location.coordinates[1]
          }}
          onCloseClick={() => {
            selectedLocation(null);
          }}
        >
          <div>{JSON.stringify(selectedLocation, 2, null)}</div>
        </InfoWindow>
      )}
      <pre>{JSON.stringify(center, 2, null)}</pre>
      <pre>{JSON.stringify(selectedLocation, 2, null)}</pre>
    </GoogleMap>
  );
}
// what kind of scripts are required in the higher order
// components to load the script correctly
const WrapperMap = withScriptjs(withGoogleMap(Map));

export default function GoogleReactMap() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <WrapperMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GKEY}`}
        loadingElement={<div style={{ height: "80vh" }} />}
        containerElement={<div style={{ height: "80vh" }} />}
        mapElement={<div style={{ height: "80vh" }} />}
      />
    </div>
  );
}

function returnSuggestionMarkers(locationsArr, handleClick) {
  let markerArray = [];
  locationsArr.forEach((location, index) => {
    markerArray.push(
      <Marker
        type_of={location.type_of_location}
        key={index}
        position={{
          lat: location.location.coordinates[0],
          lng: location.location.coordinates[1]
        }}
        defaultLabel={location.type_of_location}
        onClick={handleClick}
        id={location._id}
        creator={`${location.created_by.first_name} ${location.created_by.last_name}`}
      ></Marker>
    );
  });
  return markerArray;
}

function returnDepartureMarkers(locationsArr, setSelectedLocation) {
  let markerArray = [];
  locationsArr.forEach((location, index) => {
    markerArray.push(
      <Marker
        type_of={location.type_of_location}
        key={index}
        position={{
          lat: location.location.coordinates[0],
          lng: location.location.coordinates[1]
        }}
        defaultLabel={location.type_of_location}
        onClick={() => {
          setSelectedLocation(location);
        }}
        id={location._id}
        creator={`${location.created_by.first_name} ${location.created_by.last_name}`}
      ></Marker>
    );
  });
  return markerArray;
}

{
  /* <InfoBox
  defaultPosition={new window.google.maps.LatLng(55, 55)}
  options={{ closeBoxURL: ``, enableEventPropagation: true }}
>
  <div
    style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}
  >
    <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
      Hello, Taipei!
    </div>
  </div>
</InfoBox>  */
}
