const express = require('express');
const MeetUp = require('../models/MeetUp');
const {isLoggedIn} = require('../middlewares'); 
const router = express.Router();

router.get('/my-meetups', isLoggedIn, (req,res,next)=>{
  MeetUp.find()
  .populate("_admin")
  .populate("_users")
  .then(meetup =>{
    res.json(meetup)
  })
})

router.post('/meetups',isLoggedIn,(req,res,next)=>{
  const _admin = req.user._id;
  const meetup_date = req.body.meetup_date;
  const meetup_time = req.body.meetup_time;
  const name = req.body.name;

  const newMeetUp={
    _admin,
    meetup_date,
    meetup_time,
    name
  }
  
  MeetUp.create(newMeetUp)
  .then(meetup=>{
    res.json(meetup)
  })

})

router.delete('meetups/:meetupId',isLoggedIn,(req,res,next)=>{
  let adminId = req.user._id.toString();
  MeetUp.findById(req.params.meetupId)
  .then(deletedMeetUp =>{
    if(!deletedMeetUp)
    {
      next({success:false,status : 400})
    }
    if(adminId == deletedMeetUp._admin.toString()){
      MeetUp.findByIdAndDelete(deletedMeetUp._id)
      .then(()=>res.json({success:true}))
    }
    else{
      res.json({success:false})
    }
  })
  .catch(err => next(err))
})

module.exports = router
