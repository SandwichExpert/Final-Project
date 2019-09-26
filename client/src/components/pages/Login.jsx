import React, { useState } from 'react'
import api from '../../api'
import { useForm } from '../../hooks'
import { Link } from 'react-router-dom';


export default function Login(props) {
  const { formValues, getInputProps } = useForm({ lang: 'en' })

  function handleSubmit(e) {
    e.preventDefault()
    api
      .login(formValues.email, formValues.password)
      .then(result => {
        console.log('SUCCESS!')
        props.history.push('/') // Redirect to the home page
      })
      .catch(err => setMessage(err.toString()))
  }

  const [message, setMessage] = useState(null)

  return (
    <div className="mobile-container">
      {/* <img src="" alt="Maptee" className="main_logo"/> */}
      <div className="mobile-background">
      <form onSubmit={handleSubmit} >
        <b>Email</b> <br/> <input type="email" {...getInputProps('email')} placeholder="Your email" className="inputs"/> <br/>
        <b>Password</b> <br/>  <input type="password" {...getInputProps('password')} placeholder="Your password" className="inputs" />
        <br />
        {/* <Link to="" className="forgotten">Forgotten password?</Link> */}
        {/* <span className="forgotten">Forgotten Password?</span> */}
        <button className = "button">Login</button>
        <br/>
        <Link className = "link" to='/signup'>Forgotten password?</Link><br/>
        <Link className = "link" to='/signup'>No account yet?</Link>
      </form>
      {message && <div className="info info-danger">{message}</div>}
      </div>
    </div>
  )
}
