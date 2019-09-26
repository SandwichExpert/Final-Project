import React, { useEffect, useState } from 'react'
// import './App.css'
import { withScriptjs } from 'react-google-maps'
import MyMapComponent from './../pages/MyMapComponent'
// import SearchBox from './components/SearchBox'
function Maps() {
  const MapLoader = withScriptjs(MyMapComponent)

  // const [places, setPlaces] = useState([])

  // const handleSearch = place => {
  //   setPlaces([...places, place])
  // }
  console.log(process.env.REACT_APP_GOOGLE_KEY)
  return (
    <div className="maps">
      {/* <SearchBox handleSearch={handleSearch} /> */}
      <MapLoader
        // places={places}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />
        }
      />
    </div>
  )
}

export default Maps
