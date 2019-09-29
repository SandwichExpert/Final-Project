import React, { useState, useEffect } from "react";
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
  const [lookupLocation, setLookUpLocation] = useState("");
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [departureLocations, setDepartureLocations] = useState([]);
  const [center, setCenter] = useState({ lat: 48, lng: 3 });
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // const meetupId = props.match.params.meetupId
  useEffect(() => {
    api
      .getMeetUp("5d8e12584b7e0d25684e246d")
      .then(meetup => {
        setSuggestedLocations(meetup._suggested_locations);
        setDepartureLocations(meetup._departure_locations);
        getCurrentLocation();
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

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
    <GoogleMap
      defaultZoom={10}
      defaultCenter={center}
      defaultOptions={{ styles: mapStyles }}
      options={{
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false
      }}
    >
      {returnSuggestionMarkers(suggestedLocations, handleSuggestionMarkerClick)}
      {returnDepartureMarkers(departureLocations, setSelectedLocation)}
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
      {/* <pre>{JSON.stringify(center, 2, null)}</pre>
      <pre>{JSON.stringify(selectedLocation, 2, null)}</pre> */}
    </GoogleMap>
  );
}

const WrapperMap = withScriptjs(withGoogleMap(Map));

export default function GoogleReactMap() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <WrapperMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GKEY}`}
        loadingElement={<div style={{ height: "100vh" }} />}
        containerElement={<div style={{ height: "100vh" }} />}
        mapElement={<div style={{ height: "100vh" }} />}
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
        defaultLabel={location.created_by.first_name.substr(0, 1)}
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
        defaultLabel={location.created_by.first_name.substr(0, 1)}
      ></Marker>
    );
  });
  return markerArray;
}

const departureInfoDisplay = selectedLoc => {
  return (
    <div>
      <h5>departure</h5>
      <p>
        {selectedLoc.created_by.first_name} {selectedLoc.created_by.last_name}
      </p>
    </div>
  );
};
