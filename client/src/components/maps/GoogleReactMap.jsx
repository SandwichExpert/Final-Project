import React, { useState } from 'react'
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps'
import api from '../../api'

function Map(props) {
  return <GoogleMap defaultZoom={10} defaultCenter={{ lat: 55, lng: 55 }} />
}

// what kind of scripts are required in the higher order
// components to load the script correctly
const WrapperMap = withScriptjs(withGoogleMap(Map))

export default function GoogleReactMap() {
  const [lookupLocation, setLookUpLocation] = useState('')
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      //
      <WrapperMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GKEY}`}
        loadingElement={<div style={{ height: '100vh' }} />}
        containerElement={<div style={{ height: '100vh' }} />}
        mapElement={<div style={{ height: '100vh' }} />}
      />
    </div>
  )
}
