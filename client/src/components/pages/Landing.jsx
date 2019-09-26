import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import logo from '../../assets/maptee_logo.svg'

// const buttonStyle = {
//   backgroundColor: '#6BB39A',
//   boxShadow: '5px 5px 4px rgba(0, 0, 0, 0.25)',
//   borderRadius: '20px',
//   borderColor: 'transparent',
// }

export default function Landing() {
  return (
    <div className="landing">
      <img src={logo} id="landing__logo"></img>
      <div className="landing__buttons">
        <Button id="landing__loginbtn">
          <Link to="/login" id="landing__loginlink">
            Login
          </Link>
        </Button>
        <Button id="landing__signupbtn">
          <Link to="/signup" id="landing__signuplink">
            Sign Up
          </Link>
        </Button>
      </div>
    </div>
  )
}
