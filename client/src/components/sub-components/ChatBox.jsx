import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { CTX } from "./Store";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "320px",
    margin: "15px",
    padding: theme.spacing(3, 2),
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: "99",
    marginRight: "5%",
    marginBottom: "5%"
  },
  flex: {
    display: "flex",
    alignItems: "center"
  },
  flexColumn: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexFlow: "column wrap",
    alignContent: "flex-start"
  },
  topicsWindow: {
    width: "30%",
    maxHeight: "300px",
    borderRight: "1px solid grey"
  },
  chatWindow: {
    width: "90%",
    maxHeight: "300px",
    padding: "20px",
    overflow: "auto",
    display: "flex",
    flexFlow: "column nowrap",
    textAlign: "left"
  },
  chatBox: {
    width: "85%"
  },
  button: {
    width: "15%",
    backgroundColor: "#6b7db3",
    color: "#ffffff",
    fontWeight: 200
  }
}));

export default function ChatBox(props) {
  const classes = useStyles();

  const { allChats, sendChatAction, user} = React.useContext(CTX);

  const topics = Object.keys(allChats);

  const [activeTopic, changeActiveTopic] = React.useState(topics[0]);
  const [textValue, changeTextValue] = React.useState("");

  const users = [props.meetup._users];
  console.log(users);

  // function getUserFromUsers(userId) {
  //   let userAvatar = users
  //     .filter(user => user._id === userId)
  //     .map(user => {
  //       userAvatar === user.avatar;
  //     });
  //   return userAvatar;
  // }

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h4" component="h4">
          {props.meetup.name}
        </Typography>
        <Typography component="h5">{props.user.first_name}</Typography>
        <div className={classes.flex}>
          {/* <div className={classes.topicsWindow}>
            <List>
              {topics.map(topic => (
                <ListItem
                  key={topic}
                  button
                  onClick={e => changeActiveTopic(e.target.innerText)}
                >
                  <ListItemText primary={topic} />
                </ListItem>
              ))}
            </List>
          </div> */}
          <div className={classes.chatWindow}>
            {allChats[activeTopic].map((chat, i) => {
              // console.log(allChats)
              return(
              <div className={classes.flexColumn} key={i}>
                  <Chip
                    label={chat.from}
                    className={classes.chip}
                    style={{ backgroundColor: "#6bb39a", color: "#ffffff" }}
                  />
                  <Typography variant="body1" gutterBottom>
                    {chat.msg}
                  </Typography>
                </div>
                )
            })}
          </div>
        </div>
        <div className={classes.flex}>
          <TextField
            id="standard-name"
            label="Send a message"
            className={classes.chatBox}
            value={textValue}
            onChange={
              e => {
                changeTextValue(e.target.value)
                console.log(textValue)
            }}
          />
          <Button
            variant="contained"
            color="inherit"
            className={classes.button}
            onClick={
              () => {
                sendChatAction({
                  from: user,
                  msg: textValue,
                  topic: activeTopic,
                })
                console.log(textValue)
              changeTextValue("");
            }}
          >
            Send
          </Button>
        </div>
      </Paper>
    </div>
  );
}
