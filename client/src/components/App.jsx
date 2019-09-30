import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import Home from "./pages/Home";
import User from "./pages/User";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import Meetup from "./pages/Meetup";
import CreateMeetup from "./pages/CreateMeetup";
import MyMapComponent from "./maps/MyMapComponent";
import Maps from "./maps/Map";
import EditUser from "./pages/EditUser";
import GoogleMap from "./maps/GoogleMap";
import GoogleReactMap from "./maps/GoogleReactMap";

export default function App() {
  return (
    <div className="App">
      {/* <MainNavbar /> */}
      <Switch>
        <Route path="/home" component={Home} />
        <Route exact path="/" component={Landing} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/user/:userId" component={User} />
        <Route path="/my-meetup/:meetupId" component={Meetup} />
        <Route path="/map" component={GoogleMap} />
        <Route path="/reactmap" component={GoogleReactMap} />
        <Route path="/createmeetup" component={CreateMeetup} />
        <Route path="/edit-user" component={EditUser}/>
        {/* <Route render={() => <h2>404</h2>} /> */}
      </Switch>
    </div>
  );
}
