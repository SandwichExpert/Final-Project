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

router.post('/:meetupId', isLoggedIn, (req, res, next) => {
  const options = {new:true}
  const meetup = req.params.meetupId
  MeetUp.findByIdAndUpdate(meetup, { $push: { _users: req.user } },options)
  .then(updatedMeetup =>{
    res.json(updatedMeetup);
  })
})

// router.delete('/:meetupId/:meetupUserId', isIdentified, (req, res, next) => {
//   const options = {new:true};
//   const meetup = req.params.meetupId;
//   const meetupUser = req.params.meetupUserId;
//   const adminId = req.params.admin

//   MeetUp.findById(meetupUser)
//   .then(deletedUser => {
//     if(!deletedUser){
//       next({success:false, status : 400})
//     }
//     if (adminId == meetup.admin.toString() || deletedUser.id == meetupUser){
//       MeetUp.findByIdAndDelete(deletedUser._id).then(()=>{
//         res.json({success:true})
//       })
//     }
//     else res.json({success : false, status : 403})
//   })
//   MeetUp.findByIdAndDelete(meetup, meetupUser,options)
//   .then(updatedMeetup =>{
//     res.json(updatedMeetup);
//   })
// })

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
