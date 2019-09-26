import React, { useState, useEffect } from 'react'
import api from '../../api'
import UserDisplay from '../sub-components/UserDisplay'

export default function Home() {
  const [user, setUser] = useState('')
  const [friends, setFriends] = useState('')
  const [count, setCount] = useState('')
  const [meetups, setMeetups] = useState('')
  useEffect(() => {
    api.getUserInfo().then(userInfo => {
      console.log(userInfo)
      setFriends(userInfo._friends)
      setCount(userInfo._friends.length)
      userInfo._friends = undefined
      setMeetups(userInfo._meetups)
      userInfo._meetups = undefined
      setUser(userInfo)
    })
  }, [])
  return (
    <div className="home">
      {user !== '' && (
        <div className="user-follower-container">
          <UserDisplay
            user={user}
            friends={friends}
            count={count}
          ></UserDisplay>
        </div>
      )}
      {/* {api.isLoggedIn() && <div>Hello</div>} */}
      {/* <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(friends, null, 2)}</pre> */}
    </div>
  )
}
