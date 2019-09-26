import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Switch } from 'react-router-dom'
import MainNavbar from './MainNavbar'
import Home from './pages/Home'
import User from './pages/User'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
<<<<<<< HEAD
import Meetup from './pages/Meetup'
=======
import MeetUps from './pages/MeetUps'
import MyMapComponent from './pages/MyMapComponent'
import Maps from './pages/Map'
>>>>>>> 195e197... map

export default function App() {
  return (
    <div className="App">
      {/* <MainNavbar /> */}
      <Switch>
        <Route path="/" exact component={Maps} />
        <Route path="/landing" component={Landing} />
        <Route path="/meetups" component={MeetUps} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/user/:userId" component={User} />
        <Route path="/meetup/" component={Meetup} />
        <Route render={() => <h2>404</h2>} />
      </Switch>
    </div>
  )
}
