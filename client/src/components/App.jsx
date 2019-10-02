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
import EditUser from "./pages/EditUser";
import GoogleReactMap from "./maps/GoogleReactMap";
import LocationSearchBox from "./maps/LocationSearchBox";
import JoinMeetup from "./pages/JoinMeetup";
import EditMeetup from "./pages/EditMeetup";

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
        <Route path="/reactmap" component={GoogleReactMap} />
        <Route path="/createmeetup" component={CreateMeetup} />
        <Route path="/edit-user" component={EditUser} />
        <Route path="/join" component={JoinMeetup} />
        <Route path="/searchbox" component={LocationSearchBox} />
        <Route path="/edit-meetup/:meetupId" component={EditMeetup}/>
        {/* <Route render={() => <h2>404</h2>} /> */}
      </Switch>
    </div>
  );
}
