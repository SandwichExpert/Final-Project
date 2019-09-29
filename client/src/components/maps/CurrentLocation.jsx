import React, { useState } from "react";
import ReactDOM from "react-dom";

export default function CurrentLocation() {
  const [state, setState] = useState({
    zoom: 14,
    initialCenter: {
      lat: -1.2884,
      lng: 36.8233
    },
    centerAroundCurrentLocation: false,
    visible: true
  });
  const [userLocation, setuserLocation] = useState(state.initialCenter);
  return <div></div>;
}
