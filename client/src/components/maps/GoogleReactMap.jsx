import React, { useState, useEffect } from "react";
// const meetupId = props.match.params.meetupId

import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker
} from "react-google-maps";
import api from "../../api";
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");

function Map(props) {
  const [lookupLocation, setLookUpLocation] = useState("");
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [departureLocations, setDepartureLocations] = useState([]);

  useEffect(() => {
    api
      .getMeetUp("5d8dabc8eb053440b49527b0")
      .then(meetup => {
        console.log(meetup);
        setSuggestedLocations(meetup._suggested_locations);
        setDepartureLocations(meetup._departure_locations);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <GoogleMap defaultZoom={3} defaultCenter={{ lat: 55, lng: 55 }}>
      {suggestedLocations.map(location => {
        return (
          <Marker
            position={{
              lat: location.location.coordinates[0],
              lng: location.location.coordinates[1]
            }}
          ></Marker>
        );
      })}
      <pre>{JSON.stringify(suggestedLocations)}</pre>
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
