import React, { useRef, useState, useEffect } from 'react'
import api from '../../api'
<<<<<<< HEAD
// import UserDisplay from '../sub-components/UserDisplay'
// import useStateWithCallback from 'use-state-with-callback'
=======
>>>>>>> 40a8491... maps

export default function GoogleMap(props) {
  // const meetupId = props.match.params.meetupId
  const [suggestedLocations, setSuggestedLocations] = useState([])
  const [departureLocations, setDepartureLocations] = useState([])
  const [lookupLocation, setLookUpLocation] = useState('')
  const [user, setUser] = useState(null)
  const mapDomRef = useRef(null)

  useEffect(() => {
    // get all the locations and set the state of our departures and suggestions
    getLocations()
    setUser(api.getLocalStorageUser())
  }, [])

  useEffect(() => {
    // get all the locations and set the state of our departures and suggestions
    renderMap()
    setUser(api.getLocalStorageUser())
  }, [])

  useEffect(() => {
    console.log(suggestedLocations)
    if (!suggestedLocations && user) return
    console.log('map will render')
    renderMap()
  }, [suggestedLocations, user])

  function handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    setLookUpLocation(value)
  }

  const getLocations = () => {
    api
      .getMeetUp('5d8e12584b7e0d25684e246d')
      
      .then(meetup => {
        console.log(meetup._suggested_locations,'------------------------')
        setSuggestedLocations(meetup._suggested_locations)
        setDepartureLocations(meetup._departure_locations)
      })
      .catch(err => console.log(err))
  }

  const renderMap = () => {
    // script to use the places api
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GKEY}&libraries=places`
    )
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GKEY}&callback=initMap`
    )
    // loadScript(
    //   `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GKEY}&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GKEY}`
    // )
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

    var service = new window.google.maps.places.PlacesService(map)
    console.log(service)

    var request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['name', 'geometry'],
    }

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

    service.findPlaceFromQuery(request, function(results, status) {
      console.log('hhhh')
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log('here')
        setLookUpLocation(results[0].geometry.location)
        map.setCenter(results[0].geometry.location)
      }
    })
  }

  return (
    <div>
      <div id="map" ref={mapDomRef}></div>
      <input
        type="text"
        value={lookupLocation}
        onChange={handleChange}
        name="lookupLocation"
      />
      <pre>{JSON.stringify(lookupLocation, null, 2)}</pre>
    </div>
  )
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
