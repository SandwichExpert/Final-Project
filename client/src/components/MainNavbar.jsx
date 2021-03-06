import React from 'react'
import api from '../api'
import logo from '../logo.svg'
import { Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'

function MainNavbar(props) {
  function handleLogoutClick(e) {
    api.logout()
  }
  return (
    <nav className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Maptee</h1>
      <NavLink to="/" exact>
        Home
      </NavLink>
      <NavLink to="/landing">Landing</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/meetups">Meetups</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      {!api.isLoggedIn() && <NavLink to="/signup">Signup</NavLink>}
      {!api.isLoggedIn() && <NavLink to="/login">Login</NavLink>}
      {api.isLoggedIn() && (
        <Link to="/" onClick={handleLogoutClick}>
          Logout
        </Link>
      )}
      <NavLink to="/secret">Secret</NavLink>
    </nav>
  )
}

export default withRouter(MainNavbar)
