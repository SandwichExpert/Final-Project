import React, { useState, useEffect } from 'react'
import FriendDisplay from './FriendDisplay'

export default function UserDisplay(props) {
  return (
    <div className="user-display">
      <div
        className="background-image"
        style={{
          backgroundImage: `url(https://cdn.wallpapersafari.com/39/34/IhAtRd.png)`,
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
        <button className="buttons__follow">
          <b>Follow </b>
        </button>
        <button className="buttons__message">
          <b>Message</b>
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
