import React, { useState } from 'react'
import api from '../../api'

export default function Signup(props) {
  const [state, setState] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    avatar: '',
  })

  function handleInputChange(event) {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    })
  }

  function handleClick(e) {
    e.preventDefault()
    let data = {
      email: state.email,
      first_name: state.first_name,
      last_name: state.last_name,
      password: state.password,
      avatar: state.avatar,
    }
    api
      .signup(data)
      .then(result => {
        console.log('SUCCESS!')
        props.history.push('/') // Redirect to the home page
      })
      .catch(err => setState({ message: err.toString() }))
  }
  return (
    <div className="Signup">
      <h2>Signup</h2>
      <form>
        email:{' '}
        <input
          type="email"
          value={state.email}
          name="email"
          onChange={handleInputChange}
        />{' '}
        <br />
        First Name:{' '}
        <input
          type="text"
          value={state.first_name}
          name="first_name"
          onChange={handleInputChange}
        />{' '}
        <br />
        Last Name:{' '}
        <input
          type="text"
          value={state.last_name}
          name="last_name"
          onChange={handleInputChange}
        />{' '}
        <br />
        Password:{' '}
        <input
          type="password"
          value={state.password}
          name="password"
          onChange={handleInputChange}
        />{' '}
        <br />
        Avatar:{' '}
        <input
          type="file"
          value={state.file}
          name="avatar"
          onChange={handleInputChange}
        />{' '}
        <br />
        <button onClick={e => handleClick(e)}>Signup</button>
      </form>
      {state.message && <div className="info info-danger">{state.message}</div>}
    </div>
  )
}
