import React, { Component } from 'react';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import moment from 'moment'
import 'react-chat-widget/lib/styles.css';
import Sockets from '../../../node_modules/socket.io-client/dist/socket.io.js';
import { emit } from 'cluster';


export default function ChatBox(props) {
  function componentDidMount() {
    addResponseMessage("Welcome to this awesome chat!");
  }

  function getSocket(){
    var socket = io();
    ('form').submit(function(e){
      e.preventDefault();
      socket.emit('chat message', ('#m').val());
      ('#m').val('');
      return false;
    });
  }
  

  function handleNewUserMessage(newMessage){
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
  }
  function dateDisplay(dateString){
    const date = moment(dateString).format("MMM DD");
    return date;
  }

    return (
      <div className="App">
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          // profileAvatar={'<img src='+props.user.avatar+' alt=logo/>'}
          title={props.meetup.name}
          subtitle={dateDisplay(props.meetup.meetup_date) + " - "+ props.meetup.meetup_time}
        />
      </div>
    );
}



