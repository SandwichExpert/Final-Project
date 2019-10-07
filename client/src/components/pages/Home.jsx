import React, { useState, useEffect } from "react";
import api from "../../api";
import UserDisplay from "../sub-components/UserDisplay";
import moment from "moment";
import ChatBox from "../sub-components/ChatBox";

export default function Home(props) {
  const [user, setUser] = useState("");
  const [friends, setFriends] = useState("");
  const [count, setCount] = useState("");
  const [meetups, setMeetups] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);

  useEffect(() => {
    api.getUserInfo().then(userInfo => {
      console.log(userInfo);
      setFriends(userInfo._friends);
      setCount(userInfo._friends.length);
      userInfo._friends = undefined;
      var filterMeetups = filteredMeetups(userInfo._meetups);
      setMeetups(filterMeetups);
      userInfo._meetups = undefined;
      setUser(userInfo);
      console.log("here", meetups);
    });
  }, []);

  function toggleDiv() {
    const { show } = isChatActive;
    setIsChatActive({ show: !show });
  }

  function filteredMeetups(meetups) {
    return meetups.sort(
      (a, b) => new moment(a.meetup_date) - new moment(b.meetup_date)
    );
  }

  if (!user) {
    return (
      <div className="mobile_loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {user !== "" && (
        <div className="user-follower-container">
          <UserDisplay
            user={user}
            friends={friends}
            count={count}
            meetups={meetups}
          ></UserDisplay>
          <Store user={user} meetup={meetup}>
        {isChatActive.show && <ChatBox user={user} meetup={meetup} />}
      </Store>
      <Button variant="fab" aria-label="add" style={style} onClick={toggleDiv}>
        <i className="fas fa-comment"></i>
      </Button>
        </div>
      )}
      {/* {api.isLoggedIn() && <div>Hello</div>} */}
      {/* <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(friends, null, 2)}</pre> */}
    </div>
  );
}
