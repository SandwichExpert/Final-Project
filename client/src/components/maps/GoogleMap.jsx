import React, { useState, useEffect } from 'react'
import api from '../../api'
import UserDisplay from '../sub-components/UserDisplay'
import axios from 'axios'

export default function GoogleMap(props) {
  const [suggestedLocations, setSuggestedLocations] = useState([])

  useEffect(() => {
    renderMap()
  }, [suggestedLocations])

  const getLocations = () => {
    api
      .getMeetUp('5d8dabc8eb053440b49527b0')
      .then(meetup => {
        console.log(meetup, '---------------')
        console.log(meetup._suggested_locations)
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
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    })

    suggestedLocations.map(location => {
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

  return <div id="map"></div>
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

// ;<script
//   src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
//   async
//   defer
// ></script>
