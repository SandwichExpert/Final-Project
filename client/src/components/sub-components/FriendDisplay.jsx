import React, { useState } from 'react'

const followersImgStyle = {
  width: 50,
  borderRadius: '50%',
}

export default function FriendsDisplay({ friends, count }) {
  return (
    <div className="followers">
      <p className="followers__count">
        <i class="fas fa-user-friends"></i>
        {count} friends on Maptee
      </p>
      <div className="follower__display">
        {friends.map((friend, index) => {
          if (index < 10) {
            return (
              <img
                src={friend.avatar}
                style={{
                  width: 50,
                  borderRadius: '50%',
                  zIndex: count - index,
                  position: 'relative',
                  right: `${index * 2.5}%`,
                }}
              ></img>
            )
          } else if (index === 10) {
            return (
              <div
                className="extra-followers"
                style={{
                  zIndex: count - index,
                  position: 'relative',
                  right: `${index * 2.5}%`,
                }}
              >
                <span style={{ width: 50 }}>+{count - index + 1} </span>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
