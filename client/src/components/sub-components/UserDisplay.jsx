import React, {useState} from "react";
import FriendDisplay from "./FriendDisplay";
import { Link } from "react-router-dom";
import moment from 'moment'


export default function UserDisplay(props) {
  console.log(props.meetups);
  const [isAdmin, setIsAdmin]=useState(false);
  const [editMeetup, setEditMeetup]=useState(null);

  function dateDisplay(dateString){
    const date = moment(dateString).format("MMM DD")
    console.log(date,'--------------*************----------')
    return date
  }

  function handleEditClick(e){
    console.log(e.target._data);
    const meetupId= e.target._data;
    setEditMeetup(meetupId) 



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
            {props.user.city}
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
            if(props.user._id === meetup._admin && !isAdmin){
              setIsAdmin(true);
            }
            return (
              <tr key={index}>
                <td className="meetup-name" >
                  <Link to={`/my-meetup/${meetup._id}`} 
                  style ={{color:`${props.user._id===meetup._admin ? 'red': 'black'}`}}>{meetup.name}</Link>
                </td>
                <td>{meetup.meetup_time}</td>
                <td>{dateDisplay(meetup.meetup_date)}</td>
                {props.user._id==meetup._admin ? <td>
                  <button _data={meetup._id} style={{border:"none",background:"none"}} onClick={
                    handleEditClick
                  }>
                    <i className="fas fa-edit" _data={meetup._id}></i>
</button>
                  </td>
                  :null}
              </tr>
            );
          })}
          {/* {editMeetup && <tr>
            <td className="meetup-name" >
                  <Link to={`/my-meetup/${meetupId}`} 
                  style ={{color:`${props.user._id===props.meetups._admin ? 'red': 'black'}`}}>{pmeetups.name}</Link>
                </td>
          </tr> } */}
        </tbody>
      </table>
      {/* <div>{JSON.stringify(props.meetups)}</div> */}
    </div>
  );
}
