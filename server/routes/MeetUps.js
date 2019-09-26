const express = require('express')
const MeetUp = require('../models/MeetUp')
const Location = require('../models/Location') 
const { isLoggedIn } = require('../middlewares')
const router = express.Router()

router.get('/my-meetups', isLoggedIn, (req, res, next) => {
  MeetUp.find()
    .populate('_admin')
    .populate('_users')
    .then(meetup => {
      res.json(meetup)
    })
})

router.get('/:meetupId', isLoggedIn, (req, res, next) => {
  const id = req.params.meetupId
  MeetUp.findById(id).then(meetup => {
    res.json(meetup)
  })
})

router.post('/', isLoggedIn, (req, res, next) => {
  const _admin = req.user._id
  const meetup_date = req.body.meetup_date
  const meetup_time = req.body.meetup_time
  const name = req.body.name

  const newMeetUp = {
    _admin,
    meetup_date,
    meetup_time,
    name,
  }

  MeetUp.create(newMeetUp)
  .then(meetup => {
    res.json(meetup)
  })
})

router.post('/:meetupId/suggested-location',isLoggedIn,(req,res,next)=>{
  const {lat,lng} = req.body;
  const options = { new: true };
  const meetup = req.params.meetupId;
  const newLocation = {
    type_of_location:req.body.type_of,
    location: {
      coordinates:[lat,lng]
    }
  };
  // console.log(req.body.type_of,"WAAAAAAAAAAAAAAAAA-------------")
  // console.log(newLocation,"!!!! ---------------------------- !!!!")
  Location.create(newLocation)
  .then(location =>{
    console.log(location, "a new location was added")
    res.json(location)
    const locationId = location._id
    MeetUp.findByIdAndUpdate(meetup,{
      $push:{
        suggested_locations : locationId
      }},options)
    .then(suggestedLocation =>{
      res.json(suggestedLocation)
    })
    .catch(err => next(err))
    
  });
  


});


router.post('/:meetupId', isLoggedIn, (req, res, next) => {
  const options = { new: true }
  const meetup = req.params.meetupId
  
  MeetUp.findByIdAndUpdate(
    meetup,
    { $push: { _users: req.user } },
    options
    ).then(updatedMeetup => {
      res.json(updatedMeetup)
    })
    .catch(err => next(err))
  })
  
  router.delete('/:meetupId/:suggestedLocationId',isLoggedIn,(req,res,next)=>{
    const currentUserId = req.user._id
    const options = {new:true};
    const meetupId = req.params.meetupId;
    const suggestedLocationId = req.params.suggestedLocationId;
    findLocationThroughMeetup(meetupId,suggestedLocationId,currentUserId)
    .then(updateSuggestedLocation =>{
      console.log(updateSuggestedLocation,"HEEEEEEERE ---------")
      res.json(updateSuggestedLocation)
    })
    .catch(err => next(err));
  })

router.delete('/:meetupId/:meetupUserId', isLoggedIn, (req, res, next) => {
  const options = { new: true }
  const meetupId = req.params.meetupId
  const meetupUserId = req.params.meetupUserId
  const currentUserId = req.user._id
  findAdminFromMeetup(meetupId, meetupUserId, currentUserId).then(
    updatedMeetup => {
      res.json(updatedMeetup)
    }
  )
  .catch(err => next(err));
})

router.delete('/:meetupId', isLoggedIn, (req, res, next) => {
  let adminId = req.user._id.toString()
  MeetUp.findById(req.params.meetupId)
    .then(deletedMeetUp => {
      if (!deletedMeetUp) {
        next({ success: false, status: 400 })
      }
      if (adminId == deletedMeetUp._admin.toString()) {
        MeetUp.findByIdAndDelete(deletedMeetUp._id).then(() =>
          res.json({ success: true })
        )
      } else {
        res.json({ success: false })
      }
    })
    .catch(err => next(err))
})

async function findAdminFromMeetup(meetupId, meetupUserId, currentUserId) {
  const meetup = await MeetUp.findById(meetupId)
  const admin = meetup._admin
  // console.log(admin,"-------------YO-----------")
  if (currentUserId == admin || currentUserId == meetupUserId) {
    // console.log(currentUserId,"-------------YO-----------")
    const updatedMeetup = await MeetUp.findByIdAndUpdate(
      meetupId,
      { $pull: { _users: meetupUserId } },
      { new: true }
    )
    // console.log(updatedMeetup,"YAAAAAAAAAAAAAAAAAAAAAAA")
    return updatedMeetup
  }
}

async function findLocationThroughMeetup(meetupId,suggestedLocationId,currentUserId){
  const meetup = await MeetUp.findById(meetupId)
  console.log(meetup,'"!!!!!!!!!!!!!!!!!!!!!')
  const admin = meetup._admin
  console.log(admin)
  console.log(currentUserId)

  if(currentUserId == admin.toString()){
    const updateSuggestedLocation = await MeetUp.findByIdAndUpdate(
      meetupId,
      {$pull : {suggested_locations:suggestedLocationId}},
      {new:true}
    )
    console.log(updateSuggestedLocation,"WATAAAAAAA")
    return updateSuggestedLocation;
  }
}

module.exports = router
