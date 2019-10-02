import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/maptee-logo.svg'

export default function Landing() {
  return (
    <div className="landing">
      <img src={logo} className="landing__logo"></img>
      <div className="landing__buttons">
        <button className="button">
          <b>
            <Link to="/login" id="landing__signuplink">
              Log In
            </Link>
          </b>
        </button>
        <button className="button">
          <b>
            <Link to="/signup" id="landing__signuplink">
              Sign Up
            </Link>
          </b>
        </button>
      </div>
    </div>
  )
}
