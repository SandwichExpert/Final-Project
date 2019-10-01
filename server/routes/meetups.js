const express = require("express");
const MeetUp = require("../models/MeetUp");
const User = require("../models/User");
const Location = require("../models/Location");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();
var mongoose = require("mongoose");

// get a users meet ups -- check
router.get("/my-meetups", isLoggedIn, (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .populate("_meetups")
    .populate("friends")
    .then(user => {
      res.json(user._meetups);
      console.log(user);
    })
    .catch(err => console.log(err));
});

// get an individual meet up -- check
router.get("/one-meetup/:meetupId", (req, res, next) => {
  const id = req.params.meetupId;
  MeetUp.findById(id)
    .populate({
      path: "_suggested_locations",
      populate: { path: "created_by" }
    })
    .populate({
      path: "_departure_locations",
      populate: { path: "created_by" }
    })
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

  console.log(req.body);

  createMeetUpAddMeetupToUser(_admin, _users, meetup_date, meetup_time, name)
    .then(NewMeetUp => {
      res.json(NewMeetUp);
    })
    .catch(err => console.log(err));
});

// delete a meetup -- check
router.delete("/:meetupId", isLoggedIn, (req, res, next) => {
  let userId = String(req.user._id);
  let meetupId = req.params.meetupId;
  deleteMeetupIfAdmin(userId, meetupId)
    .then(deletedMeetup => res.json({ msg: "meetup was deleted" }))
    .catch(err => console.log(err));
});

// add a user to a meetup -- check (no need to add admin)
// we should do it only via user id in query so we use this one route (if user wants to add himself)
router.put("/add-user/:meetupId/:userid", isLoggedIn, (req, res, next) => {
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

// add a suggested location to meetup -- check
router.put("/suggested-location/:meetupId", isLoggedIn, (req, res, next) => {
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
  addSuggestedLocation(meetupId, newLocation)
    .then(updatedMeetUp => {
      res.json(updatedMeetUp);
    })
    .catch(err => console.log(err));
});

// add a depature location -- check
router.put("/departure-location/:meetupId", isLoggedIn, (req, res, next) => {
  const { lat, lng } = req.body;
  const meetupId = req.params.meetupId;
  const newLocation = {
    type_of_location: req.body.type_of,
    location: {
      coordinates: [lat, lng]
    },
    created_by: req.user._id
  };
  removeDuplicateDepartureLocation(newLocation, meetupId)
    .then(createdLocationId => {
      console.log(
        "created location id and removed possible duplicate for user",
        createdLocationId
      );
      addDepartureLocation(meetupId, createdLocationId)
        .then(updatedMeetUp => {
          console.log("meetup updated with new departure location");
          res.json(updatedMeetUp);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err, "removing the departure location"));
});

// remove suggested location -- check
router.put(
  "/remove-suggestion/:meetupId/:suggestionId",
  isLoggedIn,
  (req, res, next) => {
    const currentUserId = req.user._id;
    const meetupId = req.params.meetupId;
    const suggestionId = req.params.suggestionId;
    removeSuggestedLocation(meetupId, suggestionId, currentUserId)
      .then(updatedMeetup => {
        res.json(updatedMeetup);
      })
      .catch(err => next(err));
  }
);

// remove departure location -- check
router.put(
  "/remove-departure/:meetupId/:departureId",
  isLoggedIn,
  (req, res, next) => {
    const currentUserId = req.user._id;
    const meetupId = req.params.meetupId;
    const departureId = req.params.departureId;
    removeDepartureLocation(meetupId, departureId, currentUserId)
      .then(updatedMeetup => {
        res.json(updatedMeetup);
      })
      .catch(err => next(err));
  }
);

// add vote to suggestion -- check
router.put(
  "/add-vote/:meetupId/:suggestionId",
  isLoggedIn,
  (req, res, next) => {
    const locationId = req.params.suggestionId;
    const userId = req.user._id;
    addVote(locationId, userId)
      .then(updatedLocation => res.json({ msg: "vote was added!" }))
      .catch(err => console.log(err));
  }
);

// remove vote from suggestion -- check
router.put(
  "/remove-vote/:meetupId/:suggestionId",
  isLoggedIn,
  (req, res, next) => {
    const locationId = req.params.suggestionId;
    const userId = req.user._id;
    removeVote(locationId, userId)
      .then(updatedLocation => res.json({ msg: "vote was deleted!" }))
      .catch(err => console.log(err));
  }
);

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

async function removeSuggestedLocation(meetupId, suggestionId, currentUserId) {
  const meetup = await MeetUp.findById(meetupId);
  const admin = meetup._admin;
  const meetupID = meetup._id;
  if (currentUserId !== String(admin)) {
    return console.log("not allowed to remove");
  }
  const updateMeetup = await MeetUp.findByIdAndUpdate(
    meetupID,
    { $pull: { _suggested_locations: suggestionId } },
    { new: true }
  );
  return updateMeetup;
}

async function removeDepartureLocation(meetupId, departureId, currentUserId) {
  const meetup = await MeetUp.findById(meetupId);
  const admin = meetup._admin;
  const meetupID = meetup._id;
  if (currentUserId !== String(admin)) {
    return console.log("not allowed to remove");
  }
  const updateMeetup = await MeetUp.findByIdAndUpdate(
    meetupID,
    { $pull: { _departure_locations: departureId } },
    { new: true }
  );
  return updateMeetup;
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
  console.log("********************");
  console.log(newMeetUp);

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

async function addSuggestedLocation(meetupId, newLocation) {
  const createdLocation = await Location.create(newLocation);
  const newLocationId = createdLocation._id;
  console.log(meetupId);
  const updatedMeetup = await MeetUp.findByIdAndUpdate(
    meetupId,
    {
      $addToSet: {
        _suggested_locations: newLocationId
      }
    },
    { new: true }
  );
  console.log(updatedMeetup);
  return updatedMeetup;
}

async function addDepartureLocation(meetupId, createdLocationId) {
  const updatedMeetup = await MeetUp.findByIdAndUpdate(
    meetupId,
    {
      $addToSet: {
        _departure_locations: createdLocationId
      }
    },
    { new: true }
  );
  return updatedMeetup;
}

async function deleteMeetupIfAdmin(userId, meetupId) {
  const meetup = await MeetUp.findById(meetupId);
  const adminId = String(meetup._admin);
  if (userId !== adminId) {
    return console.log("not allowed to delete");
  }
  const deletedMeetup = await MeetUp.findByIdAndDelete(meetupId);
  return deletedMeetup;
}

async function addVote(locationId, userId) {
  const updatedLocation = await Location.findByIdAndUpdate(
    locationId,
    {
      $addToSet: {
        votes: userId
      }
    },
    { new: true }
  );
  return updatedLocation;
}

async function removeVote(locationId, userId) {
  const updatedLocation = await Location.findByIdAndUpdate(
    locationId,
    {
      $pull: {
        votes: userId
      }
    },
    { new: true }
  );
  return updatedLocation;
}

async function removeDuplicateDepartureLocation(newLocation, meetupId) {
  const departureCreator = newLocation.created_by;
  const createdLocation = await Location.create(newLocation);
  const createdLocationId = createdLocation._id;
  let duplicateDepartureId;
  const meetup = await MeetUp.findById(meetupId).populate(
    "_departure_locations"
  );
  console.log(createdLocationId, departureCreator);
  if (meetup._departure_locations.length !== 0) {
    meetup._departure_locations.forEach(loc => {
      console.log(loc.created_by.equals(departureCreator));
      if (loc.created_by.equals(departureCreator)) {
        console.log("here", loc._id);
        duplicateDepartureId = loc._id;
        console.log(duplicateDepartureId);
      }
    });
  } else {
    return createdLocationId;
  }
  console.log(duplicateDepartureId, "not def");
  if (duplicateDepartureId) {
    const removedMeetup = await MeetUp.findByIdAndUpdate(
      meetupId,
      {
        $pull: {
          _departure_locations: duplicateDepartureId
        }
      },
      { new: true }
    );
    return createdLocationId;
  }
  return createdLocationId;
}

module.exports = router;
