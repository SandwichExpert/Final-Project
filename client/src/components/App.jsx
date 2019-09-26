import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Switch } from 'react-router-dom'
import MainNavbar from './MainNavbar'
import Home from './pages/Home'
import User from './pages/User'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import Meetup from './pages/Meetup'

export default function App() {
  return (
    <div className="App">
      <MainNavbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/landing" component={Landing} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/user/:userId" component={User} />
        <Route path="/meetup/" component={Meetup} />
        <Route render={() => <h2>404</h2>} />
      </Switch>
    </div>
  )
}
