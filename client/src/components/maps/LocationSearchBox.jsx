import React from "react";
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";
const {
  StandaloneSearchBox
} = require("react-google-maps/lib/components/places/StandaloneSearchBox");

export default function LocationSearchBox({
  inputQuery,
  handleInputQuery,
  onSearchBoxMounted,
  children
}) {
  return (
    <div className="SearchBox">
      <StandaloneSearchBox></StandaloneSearchBox>
    </div>
  );
}
