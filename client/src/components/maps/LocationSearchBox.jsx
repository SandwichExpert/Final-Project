import { withScriptjs, withGoogleMap } from "react-google-maps";
import React, { useState, useEffect } from "react";
const {
  StandaloneSearchBox
} = require("react-google-maps/lib/components/places/StandaloneSearchBox");

function SearchBox(props) {
  return (
    <div data-standalone-searchbox="">
      <StandaloneSearchBox
        ref={props.onSearchBoxMounted}
        // what location should be searched in
        onPlacesChanged={props.onPlacesChanged}
        bounds={props.bounds}
      >
        <input type="text" placeholder="leaving from?" className="inputs" />
      </StandaloneSearchBox>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          overflow: "hidden",
          overflowY: "scroll",
          height: 100
        }}
      >
        {props.departureCheck && props.placesFound && (
          <h2 style={{ margin: "0 auto" }}>check your departure</h2>
        )}
        {props.departureCheck &&
          props.placesFound &&
          props.placesFound.slice(0, 3).map(place => {
            return <PlaceDisplay place={place} />;
          })}
      </div>
    </div>
  );
}

const WrapperSearchBox = withScriptjs(SearchBox);

export default function LocationSearchBox(props) {
  useEffect(() => {
    getCurrentLocation();
    setLoading(false);
  }, []);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 2, lng: 50 });
  const [queriedPlaces, setQueriedPlaces] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [radioSelected, setRadioSelected] = useState(false);
  const refs = {};
  // when the searchbox loads a ref will be created for this HOC to use
  const onSearchBoxMounted = ref => {
    return (refs.searchBox = ref);
  };
  // this is an event handler to be used inside a searchbox
  // fires when user looks for a places
  const onPlacesChanged = () => {
    // we created a ref to the searchbox upon mounting
    const newPlaces = refs.searchBox.getPlaces();
    setQueriedPlaces(newPlaces);
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
  if (loading) {
    return <h1>Loading ...</h1>;
  }

  function handleSearchRadioSelection() {
    if (radioSelected) {
      // clear all previos radio buttons selected
      // select the other clicked button
    } else {
      // just select this one radio button
    }
  }

  return (
    <div style={{ width: "100vw", height: "5%" }}>
      <WrapperSearchBox
        // if to the searchbox this prop was given 
        // as true a list with locations will appear
        // out of which you have to pick 
        suugestionCheck={props.suggestion}
        radioSelected={radioSelected}
        handleSearchRadioSelection={handleSearchRadioSelection}
        onSearchBoxMounted={onSearchBoxMounted}
        onPlacesChanged={onPlacesChanged}
        placesFound={queriedPlaces}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GKEY}`}
        loadingElement={<div style={{ height: "20vh" }} />}
        containerElement={<div style={{ height: "20vh" }} />}
      ></WrapperSearchBox>
      {/* <pre>{JSON.stringify(queriedPlaces, null, 2)}</pre> */}
    </div>
  );
}

const PlaceDisplay = ({ place, children }) => {
  return (
    <div
      key={place.id}
      className="location-suggestions"
      lat={place.geometry.location.lat}
      lng={place.geometry.location.lng}
    >
      <label for={place.id}>
        {place.name} at {place.formatted_address}{" "}
        {place.rating && `with rating ${place.rating}/5`}
      </label>
      <input
        type="radio"
        id={place.id}
        name={place.id}
        lat={place.geometry.location.lat}
        lng={place.geometry.location.lng}
        value={`{lat: ${place.geometry.location.lat}, lng: ${place.geometry.location.lng}`}
      />
    </div>
  );
};
