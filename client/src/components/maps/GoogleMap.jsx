import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import api from '../../api'
import UserDisplay from '../sub-components/UserDisplay'
import useStateWithCallback from 'use-state-with-callback'

export default function GoogleMap(props) {
  const meetupId = props.match.params.meetupId
  const [suggestedLocations, setSuggestedLocations] = useState([])
  const mapDomRef = useRef(null)

  useEffect(() => {
    getLocations()
  }, [])

  useEffect(() => {
    console.log('here')
    console.log(suggestedLocations)
    if (!suggestedLocations.length) return
    renderMap()
  }, [suggestedLocations])

  const getLocations = () => {
    api
      .getMeetUp('5d8dabc8eb053440b49527b0')
      .then(meetup => {
        setSuggestedLocations(meetup._suggested_locations)
      })
      .catch(err => console.log(err))
  }

  const renderMap = () => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GKEY}&callback=initMap`
    )
    window.initMap = initMap
    // when js tries to render the init map it does not find it
    // we keep it visible by converting it to the window object
  }

  const initMap = () => {
    // the location we want to zoom in on
    var departureLocation = new window.google.maps.LatLng(
      suggestedLocations[0].location.coordinates[0],
      suggestedLocations[0].location.coordinates[1]
    )

    // creation of the map
    var map = new window.google.maps.Map(mapDomRef.current, {
      center: departureLocation,
      zoom: 8,
    })

    // calling all suggested locations adding a marker
    suggestedLocations.map(location => {
      console.log(location.location.coordinates, 'hehehe')
      var marker = new window.google.maps.Marker({
        position: {
          lat: location.location.coordinates[0],
          lng: location.location.coordinates[1],
        },
        map: map,
        title: 'suggested location',
      })
    })
  }

  return <div id="map" ref={mapDomRef}></div>
}

function loadScript(url) {
  // to let the browser access google
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}
