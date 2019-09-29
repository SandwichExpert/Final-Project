import React from "react";
import FriendDisplay from "./FriendDisplay";
import { Link } from "react-router-dom";

export default function UserDisplay(props) {
  console.log(props.meetups);
  return (
    <div className="user-display">
      <div
        className="background-image"
        style={{
          backgroundImage: `url(https://wallpaperaccess.com/full/97836.jpg)`,
          width: "100%"
        }}
      ></div>
      <div className="info-container">
        <div className="circular-image">
          <img className="profile-image" src={props.user.avatar}></img>
        </div>
        <div className="name-loc-container">
          <h1 className="username">Hi {props.user.first_name}</h1>
          <p className="location">
            <i className="fas fa-map-marker-alt"></i>
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
      <table className="meetup-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Meetup Time</th>
            <th>Meetup Date</th>
          </tr>
        </thead>
        <tbody>
          {props.meetups.map((meetup, index) => {
            return (
              <tr key={index}>
                <td className="meetup-name">
                  <Link to={`/my-meetup/${meetup._id}`}>{meetup.name}</Link>
                </td>
                <td>{meetup.meetup_time}</td>
                <td>{meetup.meetup_date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <div>{JSON.stringify(props.meetups)}</div> */}
    </div>
  );
}
