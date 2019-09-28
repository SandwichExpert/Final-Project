const express = require("express");
const MeetUp = require("../models/MeetUp");
const User = require("../models/User");
const Location = require("../models/Location");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();

// get a users meet ups -- check
router.get("/my-meetups", isLoggedIn, (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .populate("_meetups")
    .then(user => {
      res.json(user._meetups);
      console.log(user);
    })
    .catch(err => console.log(err));
});

// get an individual meet up -- check
router.get("/one-meetup/:meetupId", isLoggedIn, (req, res, next) => {
  const id = req.params.meetupId;
  MeetUp.findById(id)
    .populate("_suggested_locations")
    .then(meetup => {
      console.log("herer", meetup);
      res.json(meetup);
    });
});

// create one meet up add meet up to user meetups -- check
router.post("/", isLoggedIn, (req, res, next) => {
  const _admin = req.user._id;
  const _users = req.user._id;
  const meetup_date = req.body.meetup_date;
  const meetup_time = req.body.meetup_time;
  const name = req.body.name;
  createMeetUpAddMeetupToUser(_admin, _users, meetup_date, meetup_time, name)
    .then(NewMeetUp => {
      res.json(NewMeetUp);
    })
    .catch(err => console.log(err));
});

// add a user to a meetup -- check (no need to add admin)
// we should do it only via user id in query so we use this one route (if user wants to add himself)
router.post("/add-user/:meetupId/:userid", isLoggedIn, (req, res, next) => {
  const meetup = req.params.meetupId;
  const _users = req.params.userid;
  MeetUp.findByIdAndUpdate(meetup, { $addToSet: { _users } }, { new: true })
    .then(updatedMeetup => {
      res.json(updatedMeetup);
    })
    .catch(err => next(err));
});

// remove a user from the meetup -- check
router.put("/delete-user/:meetupId/:userid", isLoggedIn, (req, res, next) => {
  const meetupId = req.params.meetupId;
  const deleteUserId = req.params.userid;
  const currentUserId = req.user._id;
  console.log(meetupId, "---", deleteUserId, "----", currentUserId, "-----");
  deleteIfAdminOrUserDeleted(meetupId, deleteUserId, currentUserId)
    .then(updatedMeetup => {
      res.json(updatedMeetup);
    })
    .catch(err => next(err));
});

// add a suggested location to meetup
router.post("/suggested-location/:meetupId", isLoggedIn, (req, res, next) => {
  const { lat, lng } = req.body;
  const options = { new: true };
  const meetupId = req.params.meetupId;
  const newLocation = {
    type_of_location: req.body.type_of,
    location: {
      coordinates: [lat, lng]
    },
    created_by: req.user._id
  };
  addSuggestedLocation(lat, lng, meetupId, newLocation)
    .then(updatedMeetUp => {
      res.json(updatedMeetUp);
    })
    .catch(err => console.log(err));
});

// add a depature location
router.post("/departure-location/:meetupId", isLoggedIn, (req, res, next) => {
  const { lat, lng } = req.body;
  const options = { new: true };
  const meetup = req.params.meetupId;
  const newLocation = {
    type_of_location: req.body.type_of,
    location: {
      coordinates: [lat, lng]
    },
    created_by: req.user._id
  };
  addDepartureLocation(lat, lng, meetupId, newLocation)
    .then(updatedMeetUp => {
      res.json(updatedMeetUp);
    })
    .catch(err => console.log(err));
});

router.post(
  "/:meetupId/:suggestedLocationId/vote",
  isLoggedIn,
  (req, res, next) => {
    const locationId = req.params.suggestedLocationId;
    const userId = req.user._id;
    const options = { new: true };
    // const newVote={
    //   vote : userId
    // }
    // Location.create(newVote).then(voteAddition=>{
    //   console.log(voteAddition,'your vote will be counted')
    Location.findByIdAndUpdate(
      locationId,
      {
        $push: {
          votes: userId
        }
      },
      options
    ).then(addedVote => {
      res.json(addedVote);
    });
  }
);

router.delete(
  "/:meetupId/:suggestedLocationId",
  isLoggedIn,
  (req, res, next) => {
    const currentUserId = req.user._id;
    const options = { new: true };
    const meetupId = req.params.meetupId;
    const suggestedLocationId = req.params.suggestedLocationId;
    findLocationThroughMeetup(meetupId, suggestedLocationId, currentUserId)
      .then(updateSuggestedLocation => {
        console.log(updateSuggestedLocation, "HEEEEEEERE ---------");
        res.json(updateSuggestedLocation);
      })
      .catch(err => next(err));
  }
);

router.delete("/:meetupId", isLoggedIn, (req, res, next) => {
  let adminId = req.user._id.toString();
  MeetUp.findById(req.params.meetupId)
    .then(deletedMeetUp => {
      if (!deletedMeetUp) {
        next({ success: false, status: 400 });
      }
      if (adminId == deletedMeetUp._admin.toString()) {
        MeetUp.findByIdAndDelete(deletedMeetUp._id).then(() =>
          res.json({ success: true })
        );
      } else {
        res.json({ success: false });
      }
    })
    .catch(err => next(err));
});

async function deleteIfAdminOrUserDeleted(
  meetupId,
  deleteUserId,
  currentUserId
) {
  const meetup = await MeetUp.findById(meetupId);
  const meetupID = meetup._id;
  const adminId = meetup._admin;
  if (
    String(currentUserId) != String(adminId) &&
    String(currentUserId) != String(deleteUserId)
  ) {
    return console.log("not allowed to delete");
  }
  const updatedMeetup = await MeetUp.findByIdAndUpdate(
    meetupID,
    { $pull: { _users: deleteUserId } },
    { new: true }
  );
  return updatedMeetup;
}

async function findLocationThroughMeetup(
  meetupId,
  suggestedLocationId,
  currentUserId
) {
  const meetup = await MeetUp.findById(meetupId);
  console.log(meetup, '"!!!!!!!!!!!!!!!!!!!!!');
  const admin = meetup._admin;
  console.log(admin);
  console.log(currentUserId);
  if (currentUserId == admin.toString()) {
    const updateSuggestedLocation = await MeetUp.findByIdAndUpdate(
      meetupId,
      { $pull: { suggested_locations: suggestedLocationId } },
      { new: true }
    );
    console.log(updateSuggestedLocation, "WATAAAAAAA");
    return updateSuggestedLocation;
  }
}

async function createMeetUpAddMeetupToUser(
  _admin,
  _users,
  meetup_date,
  meetup_time,
  name
) {
  const options = { new: true };
  const newMeetUp = {
    _admin,
    _users,
    meetup_date,
    meetup_time,
    name
  };
  const createdMeetUp = await MeetUp.create(newMeetUp);
  const createdMeetUpId = createdMeetUp._id;
  const UpdatedUser = await User.findByIdAndUpdate(
    _users,
    {
      $addToSet: {
        _meetups: createdMeetUpId
      }
    },
    options
  );
  return createdMeetUp;
}

async function addSuggestedLocation(lat, lng, meetupId, newLocation) {
  const newLocation = await Location.create(newLocation);
  const newLocationId = newLocation._id;
  const updatedMeetUp = await MeetUp.findByIdAndUpdate(
    meetupId,
    {
      $addToSet: {
        _suggested_locations: newLocationId
      }
    },
    options
  );
  return updatedMeetup;
}

async function addDepartureLocation(lat, lng, meetupId, newLocation) {
  const newLocation = await Location.create(newLocation);
  const newLocationId = newLocation._id;
  const updatedMeetUp = await MeetUp.findByIdAndUpdate(
    meetup,
    {
      $addToSet: {
        _departure_location: newLocationId
      }
    },
    options
  );
  return updatedMeetup;
}

module.exports = router;
