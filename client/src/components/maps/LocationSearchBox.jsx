import React from "react";
const {
  StandaloneSearchBox
} = require("react-google-maps/lib/components/places/StandaloneSearchBox");
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";

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
