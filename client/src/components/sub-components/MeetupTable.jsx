import React, { useState } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import api from "../../api";
import moment from "moment";

function contentEditable(MeetupTable) {
  
  return class extends React.Component {
    state = {
      editing: false
    };

    toggleEdit = e => {
      e.stopPropagation();
      if (this.state.editing) {
        this.cancel();
      } else {
        this.edit();
      }
    };

    edit = () => {
      this.setState(
        {
          editing: true
        },
        () => {
          this.domElm.focus();
        }
      );
    };

    save = () => {
      this.setState(
        {
          editing: false
        },
        () => {
          if (this.props.onSave && this.isValueChanged()) {
            console.log("Value is changed", this.domElm.textContent);
          }
        }
      );
    };
    cancel = () => {
      this.setState({
        editing: false
      });
    };
    isValueChanged = () => {
      return this.props.value !== this.domElm.textContent;
    };

    

    handleKeyDown = e => {
      const { key } = e;
      switch (key) {
        case "Enter":
        case "Escape":
          this.save();
          break;
      }
    };
    render() {
      let editOnClick = true;
      const { editing } = this.state;
      if (this.props.editOnClick !== undefined) {
        editOnClick = this.props.editOnClick;
      }
      return (
        <MeetupTable
          className={editing ? "editing" : ""}
          onClick={editOnClick ? this.toggleEdit : undefined}
          contentEditable={editing}
          ref={domNode => {
            this.domElm = domNode;
          }}
          onBlur={this.save}
          onKeyDown={this.handleKeyDown}
          {...this.props}
        >
          {this.props.value}
        </MeetupTable>
      );
    }
  };
}

export default function MeetupTable(props) {
  let EditableTd = contentEditable("td");
  const [meetup,setMeetup] = useState({
    name:"",
    meetup_date:"",
    meetup_time:""
  })
  const [isAdmin, setIsAdmin] = useState(false);
  function dateDisplay(dateString) {
    const date = moment(dateString).format("MMM DD");
    return date;
  }

  // function handleInputChange(e) {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   setMeetup({ ...meetup, [name]: value });
  // }

  // function editingValue(e){
  //   e.preventDefault();
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   setMeetup({ ...meetup, [name]: value });
  //   let data = {
  //     name: meetup.name,
  //     meetup_date : meetup.meetup_date,
  //     meetup_time : meetup.meetup_time
  //   };
  //   api
  //   .editMeetup(data)
  //   .then(updatedMeetup =>{
  //     this.props.history.push("/home");
  //   })
  // }
  return (
    <table className="meetup-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Time</th>
          <th>Date</th>
          <th>Meetup</th>
        </tr>
      </thead>
      <tbody>
        {props.meetups.map((meetup, index) => {
          if (props.user._id === meetup._admin && !isAdmin) {
            setIsAdmin(true);
          }
          return (
            <tr key={index}>
              {props.user._id == meetup._admin ? (
                <EditableTd
                // onChange={editingValue}
                  value={meetup.name}
                  name = 'name'
                  style={{
                    color: `${
                      props.user._id === meetup._admin ? "red" : "black"
                    }`
                  }}
                />
              ) : (
                <td className="meetup-name">{meetup.name}</td>
              )}

              {props.user._id == meetup._admin ? (
                <EditableTd value={meetup.meetup_time} name="meetup_time"/>
              ) : (
                <td>{meetup.meetup_time}</td>
              )}
              {props.user._id === meetup._admin ? (
                <EditableTd value={meetup.meetup_date} name="meetup_date"/>
              ) : (
                <td>{dateDisplay(meetup.meetup_date)}</td>
              )}
              

              <td>
                <Link to={`/my-meetup/${meetup._id}`}>
                  <button
                    _data={meetup._id}
                    style={{ border: "none", background: "none" }}
                  >
                    <i
                      class="fas fa-street-view"
                      style={{
                        color: `${
                          props.user._id === meetup._admin ? "red" : "black"
                        }`
                      }}
                    ></i>
                  </button>
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
