import React from 'react'
import api from '../../api'

export default function Home() {
  return (
    <div className="Home">
      <h2>Home</h2>
      <p>This is a sample project with the MERN stack</p>
      {api.isLoggedIn() && <div>Hello</div>}
    </div>
  )
}
