import React, { useRef, useState, useEffect } from 'react'
import api from '../../api'
import UserDisplay from '../sub-components/UserDisplay'
import useStateWithCallback from 'use-state-with-callback'

export default function GoogleMap(props) {
  const meetupId = props.match.params.meetupId
  const [suggestedLocations, setSuggestedLocations] = useState([])
  const [departureLocations, setDepartureLocations] = useState([])
  const [user, setUser] = useState(null)
  const mapDomRef = useRef(null)

  useEffect(() => {
    // get all the locations and set the state of our departures and suggestions
    getLocations()
    setUser(api.getLocalStorageUser())
  }, [])

  useEffect(() => {
    console.log('here')
    console.log(suggestedLocations)
    if (!suggestedLocations.length && user) return
    renderMap()
  }, [suggestedLocations, user])

  const getLocations = () => {
    api
      .getMeetUp('5d8dabc8eb053440b49527b0')
      .then(meetup => {
        setSuggestedLocations(meetup._suggested_locations)
        setDepartureLocations(meetup._departure_locations)
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

    var departureIcon = {
      url:
        'https://res.cloudinary.com/dri8yyakb/image/upload/v1569582674/optimap_icons/user_tmksk6.png',
      // This marker is 20 pixels wide by 32 pixels high.
      // The origin for this image is (0, 0).
      // The anchor for this image is the base of the flagpole at (0, 32).
      size: new window.google.maps.Size(71, 71),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(17, 34),
      scaledSize: new window.google.maps.Size(25, 25),
    }

    // creation of the map
    var map = new window.google.maps.Map(mapDomRef.current, {
      center: departureLocation,
      zoom: 15,
    })

    suggestedLocations.map(location => {
      var marker = addMarker(
        location.location.coordinates[0],
        location.location.coordinates[1],
        'blue',
        map,
        '',
        departureIcon
      )
    })

    // calling all departure locations and adding a marker
    departureLocations.map(location => {
      window.google.maps.MarkerLabel.color = 'white'
      var marker = addMarker(
        location.location.coordinates[0],
        location.location.coordinates[1],
        'blue',
        map,
        '',
        departureIcon
      )
    })

    // if user accepts the map will zoom in on his location
    var infoWindow = new window.google.maps.InfoWindow()
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude
        var lng = position.coords.longitude
        var pos = { lat, lng }
        addInfoWindow(lat, lng, map, `Hey ${user.first_name}!`)
        map.setCenter(pos)
      })
    }
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

function addMarker(lat, lng, color, map, title, img) {
  return new window.google.maps.Marker({
    position: {
      lat: lat,
      lng: lng,
    },
    map: map,
    title: title,
    icon: img,
    label: title,
  })
}

function addInfoWindow(lat, lng, map, description) {
  var InfoWindow = new window.google.maps.InfoWindow()
  var position = {
    lat,
    lng,
  }
  InfoWindow.setPosition(position)
  InfoWindow.setContent(`${description}`)
  InfoWindow.open(map)
  return InfoWindow
}
