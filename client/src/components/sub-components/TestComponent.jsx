import React, { useState, useEffect } from "react";
import api from "../../api";
// setup socket.io on the client side
const io = require("socket.io-client");

// this setup has to match your backend
const socket = io("http://localhost:2000/");

export default function TestComponent(props) {
  // const meetupId = 1234;
  // const user = "someone";
  // const meetupName = "war council";
  const meetupId = props.meetupId;
  const firstname = props.username;
  const meetupName = props.meetupName;
  // states used for our socket chat
  const [messageCount, setMessageCount] = useState(0);
  // for now a user is in a room by default
  // we can change this by adding a button to leave chat
  const [inRoom, setInRoom] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // use effect tot enter and leave a room
  useEffect(() => {
    // users join a room which is connected
    if (inRoom) {
      console.log("joining the room");
      socket.emit("room", {
        room: `${meetupId}`
      });
    }
    return () => {
      if (inRoom) {
        console.log("leaving the room");
        socket.emit("leave room", {
          room: `${meetupId}`
        });
      }
    };
  });

  // use effect to handle to receive incoming messages
  useEffect(() => {
    socket.on("receive message", payload => {
      console.log(payload, "message payload ");
      setMessageCount(messageCount + 1);
      setMessages([
        ...messages,
        { incoming: true, msg: `${payload.user} ${payload.msg}` }
      ]);
      console.log("previous message count", messageCount);
    });
  });

  function handleInRoom() {
    inRoom ? setInRoom(false) : setInRoom(true);
  }

  function handleNewMessage() {
    console.log("sending a message");
    // because on reception the socket will send this messages to
    // clients that are also in this room
    socket.emit("new message", {
      room: `${meetupId}`,
      msg: `${currentMessage}`,
      user: `${firstname}`
    });
    setMessageCount(messageCount + 1);
    setMessages([...messages, { incoming: false, msg: `${currentMessage}` }]);
  }

  function handleMessageInput(e) {
    const value = e.target.value;
    setCurrentMessage(value);
  }

  return (
    <div>
      <h1>{meetupName}</h1>
      <div className="chatBox">
        {messages.map(message => {
          let color;
          message.incoming ? (color = "red") : (color = "blue");
          return (
            <div className="single-message" style={{ color: color }}>
              {message.msg}
            </div>
          );
        })}
      </div>
      <button
        className="enterLeaveButton"
        onClick={() => {
          handleInRoom();
        }}
      >
        {inRoom && "leave chat"}
        {!inRoom && "enter room"}
      </button>
      {inRoom && (
        <div className="chat-container">
          <button
            onClick={() => {
              handleNewMessage();
            }}
          >
            send new message
          </button>
          <input
            type="text"
            placeholder="type your message here"
            onChange={handleMessageInput}
          ></input>
        </div>
      )}
    </div>
  );
}
