import React, { useState, useRef, useEffect } from 'react'
import { Map, GoogleApiWrapper } from 'google-maps-react'

export default function Map() {
  function initMap() {
    let mapDomRef = useRef(null)
    let map = useRef(null).current
  }

  useEffect(() => {
    initMap(55, 55)
  }, [])

  return <div ref={mapDomRef}></div>
}
