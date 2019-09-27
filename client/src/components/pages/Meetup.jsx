import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import Logo from '../../assets/maptee_logo.svg'

export default function Meetup(props) {
  const [location, setLocation] = useState({
    departure: '',
    suggested_location: '',
    vote: [false],
  })
  const [meetup,setMeetup] = useState(null);
  const meetupId = props.match.params.meetupId;

  useEffect(()=>{
    api.getMeetup()
  })

  function handleInputChange(event) {
    setLocation({
      ...location,
      [event.target.name]: event.target.value,
    })
  }

  function handleClick(e) {
    e.preventDefault()
    let locationData = {
      departure: location.departure,
      suggested_location: location.suggested_location,
      vote: [location.vote],
    }
  }

  return (
    <div className="map">
      <div className="heading_meetup">
        <div className="left_side">
          <h2>
            {props.meetup.name}
            Name
          </h2>
          10/10/2019 - 20:00 | Bar
          {/* {props.date} - {props.time} | {props.type} */}
        </div>
        <div className="right_side">
          <Link to="/"> Home</Link>
          <Link to="/my-page">My Page</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </div>
      <div className="mobile_meetup">
        <form>
          <br />
          <input
            type="text"
            name="departure"
            placeholder="Your starting point"
            className="inputs"
            onChange={handleInputChange}
          />{' '}
          <br />
          <input
            type="text"
            name="suggested_location"
            placeholder="Your suggestion"
            className="inputs"
            onChange={handleInputChange}
          />
          <br />
          {/* <Link to="" className="forgotten">Forgotten password?</Link> */}
          {/* <span className="forgotten">Forgotten Password?</span> */}
          <button className="button" id="Confirm">
            <b>Confirm</b>
          </button>
          <br />
        </form>
      </div>
    </div>
  )
}
