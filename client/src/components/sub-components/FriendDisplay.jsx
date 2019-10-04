import React, { useState } from "react";
import api from '../../api';

export default function FriendsDisplay({ friends, count }) {
  const [friend, setFriend] = useState({ 
    email:""
  });

  function handleInputChange(e){
    const name = e.target.name;
    const value = e.target.value;
    setFriend({...friend,[name]:value})
  }

  function addNewFriend(e){
    e.preventDefault();
    api.
    addFriend(friend)
    .then(addFriend=>{
      console.log("new friend added to the list")
      window.alert('New friend addded to your list!')
    })
    .catch(err => {
      console.log(err)
      window.alert("invalid")
    })
  }

  return (
    <div className="followers">
      <p className="followers__count">
        <i className="fas fa-user-friends"></i>
        {count} friends on Maptee
      </p>
      <div className="follower__display">
        {friends.map((friend, index) => {
          if (index < 10) {
            return (
              <img
                key={index}
                className="friend-image"
                src={friend.avatar}
                style={{
                  zIndex: count - index,
                  right: `${index * 2.5}%`
                }}
              ></img>
            );
          } else if (index === 10) {
            return (
              <div
                className="extra-followers"
                style={{
                  zIndex: count - index,
                  position: "relative",
                  right: `${index * 2.5}%`
                }}
              >
                <span style={{ width: 50 }}>+{count - index + 1} </span>
              </div>
            );
          }
        })}
      </div>
      <div className="addFriend" style={{marginTop:10, display:"flex", flexFlow:"row wrap",alignItems:"center"}}>
        <input className="inputs-submit" type="text" value={friend.email} name="email" placeholder="Friend email" 
        onChange={handleInputChange}/>
        <i  className="fas fa-plus" style={{border:"none", marginLeft : 5}} onClick={addNewFriend}/>
      </div>
    </div>
  );
}
