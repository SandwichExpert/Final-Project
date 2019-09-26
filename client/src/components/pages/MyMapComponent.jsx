/* global google */

import React, { useEffect, useState } from 'react'
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps'
const MyMapComponent = props => {
  const [directions, setDirections] = useState(null)
  //   const [userTravelMode, setUserTravelMode] = useState();
  useEffect(() => {
    const directionsService = new google.maps.DirectionsService()
    const origin = 'Paris'
    const destination = 'Brest'
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result)
          console.log('results', result)
        } else {
          console.error(`error fetching directions ${JSON.stringify(result)}`)
        }
      }
    )
  }, [])
  const MyMap = withGoogleMap(props => (
    <GoogleMap defaultCenter={{ lat: 48.8566, lng: 2.3522 }} defaultZoom={13}>
      <DirectionsRenderer directions={directions} />
    </GoogleMap>
  ))
  return (
    <div>
      <MyMap
        containerElement={<div style={{ height: `100vh`, width: '100%' }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  )
}
export default MyMapComponent
