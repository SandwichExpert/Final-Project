import React, {useState} from "react";
import FriendDisplay from "./FriendDisplay";
import { Link } from "react-router-dom";

export default function UserDisplay(props) {
  console.log(props.meetups);
  const [isAdmin, setIsAdmin]=useState(false);

  function dateDisplay(dateString){
    
  }
  
  return (
    <div className="user-display">
    <div
        className="background-image"
        style={{
          backgroundImage: `url(${props.user.background_image})`,
          width: "100%"
        }}
      ></div>
      <div className="info-container">
        <div className="circular-image">
          <img className="profile-image" src={props.user.avatar}></img>
          <Link to="/edit-user">Edit profile</Link>
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
            <th>Time</th>
            <th>Date</th>
            {isAdmin && <th>Edit</th> }
          </tr>
        </thead>
        <tbody>
          {props.meetups.map((meetup, index) => {
            if(props.user._id == meetup._admin && !isAdmin){
              setIsAdmin(true);
            }
            return (
              <tr key={index}>
                <td className="meetup-name" >
                  <Link to={`/my-meetup/${meetup._id}`} 
                  style ={{color:`${props.user._id==meetup._admin ? 'red': 'black'}`}}>{meetup.name}</Link>
                </td>
                <td>{meetup.meetup_time}</td>
                <td>{meetup.meetup_date}</td>
                {props.user._id==meetup._admin ? <td>
                  <Link to="/edit-meetup"><i class="fas fa-edit"></i>
</Link>
                  </td>
                  :null}
              </tr>

            );
          })}
        </tbody>
      </table>
      {/* <div>{JSON.stringify(props.meetups)}</div> */}
    </div>
  );
}
