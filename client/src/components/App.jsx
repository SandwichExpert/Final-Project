import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Switch } from 'react-router-dom'
import MainNavbar from './MainNavbar'
import Home from './pages/Home'
import User from './pages/User'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import MeetUps from './pages/MeetUps'
import MeetUp from './pages/MeetUp'
import MyMapComponent from './maps/MyMapComponent'
import Maps from './maps/Map'
import GoogleMap from './maps/GoogleMap'

export default function App() {
  return (
    <div className="App">
      {/* <MainNavbar /> */}
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/landing" component={Landing} />
        <Route path="/meetups" component={MeetUps} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/user/:userId" component={User} />
        <Route path="/meetup" component={MeetUp} />
        <Route path="/map" exact component={GoogleMap} />
        <Route render={() => <h2>404</h2>} />
      </Switch>
    </div>
  )
}
