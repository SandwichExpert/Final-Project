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

  console.log(meetupId)

  useEffect(()=>{
    api.getMeetUp(meetupId).then(meetup =>{
      setMeetup(meetup)
      console.log("DEBUG", meetup)
    })
  },[])

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
    }
  }
  if(!meetup){
    return(
      <div className="mobile_loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }
  return (
    <div className="map">
      <div className="heading_meetup">
        <div className="left_side">
          <h2>
            {meetup.name}
          </h2>
          {meetup.meetup_date} - {meetup.meetup_time} 
        </div>
        <div className="right_side">
          <Link to="/my-page">My Page</Link>
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
