import React from 'react'
import FriendDisplay from './FriendDisplay'
import { Link } from 'react-router-dom'

export default function UserDisplay(props) {
  return (
    <div className="user-display">
      <div
        className="background-image"
        style={{
          backgroundImage: `url(https://wallpaperaccess.com/full/97836.jpg)`,
          width: '100%',
        }}
      ></div>
      <div className="info-container">
        <div className="circular-image">
          <img className="profile-image" src={props.user.avatar}></img>
        </div>
        <div className="name-loc-container">
          <h1 className="username">Hi {props.user.first_name}</h1>
          <p className="location">
            <i class="fas fa-map-marker-alt"></i>
            London
          </p>
        </div>
      </div>
      <div className="buttons">
        <button className="buttons__meetup">
          <Link to="/meetups">
            <b>My Meetups</b>
          </Link>
        </button>
        <button className="buttons__meetup">
          <Link to="/joinmeetup">
            <b>Join Meetup</b>
          </Link>
        </button>
        <button className="buttons__meetup">
          <Link to="/createmeetup">
            <b>Create Meetup</b>
          </Link>
        </button>
      </div>
      <hr></hr>
      {/* <FriendDisplay followers={user.commonFollowers} /> */}
      <FriendDisplay
        friends={props.friends}
        count={props.count}
      ></FriendDisplay>
    </div>
  )
}
