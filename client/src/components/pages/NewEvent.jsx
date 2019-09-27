import React, {Component} from 'react';
import api from '../../api';

export default class NewMeetUp extends Component{
  constructor(props){
    super(props)
    this.state= {
      name:'',
      meetup_date:'',
      meetup_time:'',
    };
    this.handleInputChange = this.handleInputChange.bind(this)
    this.addMeetupAdRedirectToMeetupPage = this.addMeetupAdRedirectToMeetupPage.bind(this)
  }
  handleInputChange(e){
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  addMeetupAdRedirectToMeetupPage(){
    const uploadData = new FormData()
    uploadData.append('name', this.state.name)
    uploadData.append('meetup_date',this.state.meetup_date)
    uploadData.append('meetup_time',this.meetup_time)

    api.addMeetUp(uploadData)
    .then(createdMeetUp => {
      this.props.history.push(`/my-meetup/${createdMeetUp._id}`)
    })
    .catch(err=>{console.log("error adding the street art")})
  }
  render(){
    return(
      <div className="mobile-container-creation">
      {/* <div className="mobile-background"> */}
          <b>Event Name</b> <br />{' '}
          <input
            type="text"
            placeholder="Name of the event"
            className="inputs"
            value={this.state.name}
            onChange={this.handleInputChange}
            name ="name"
          />{' '}
          <br />
          <b>Date</b> <br />{' '}
          <input
            type="date"
            className="inputs"
            value={this.state.meetup_date}
            onChange={this.handleInputChange}
            name='meetup_date'
          /><br/>
          <b>Date</b> <br />{' '}
          <input
            type="time"
            className="inputs"
            value={this.state.meetup_time}
            onChange={this.handleInputChange}
            name='meetup_time'
          />
          <br />
          {/* <Link to="" className="forgotten">Forgotten password?</Link> */}
          {/* <span className="forgotten">Forgotten Password?</span> */}
          <button className="button" onClick={this.addMeetupAdRedirectToMeetupPage}>
            <b>Create</b>
          </button>
          <br />
          
      </div>
   
    )
  }


}