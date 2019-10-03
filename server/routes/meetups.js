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
  // comes from the form is either current location or
  // looked up location
  const departureLatLng = req.body.departure_location;
  const newLocation = {
    type_of_location: "departure",
    location: {
      coordinates: [departureLatLng.lat, departureLatLng.lng]
    },
    created_by: req.user._id
  };
  createDepartureLocation(newLocation).then(createdLocation => {
    const departureId = createdLocation._id;
    // this function will create a meetup and add the admin / user and
    // admin departure location to the meetup
    createMeetUp(_admin, _users, meetup_date, meetup_time, name, departureId)
      .then(NewMeetUp => {
        console.log("new meetup created hooray!", NewMeetUp);
        res.json(NewMeetUp);
      })
      .catch(err => console.log(err));
  });
  console.log(req.body);
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
router.put("/join", isLoggedIn, (req, res, next) => {
  const meetup = req.body.meetupId;
  const _users = req.body.userId;
  console.log(meetup, _users, "----------------------------");
  MeetUp.findByIdAndUpdate(
    meetup,
    { $addToSet: { _users: _users } },
    { new: true }
  )
    .then(updatedMeetup => {
      console.log("heeeere");
      User.findByIdAndUpdate(
        _users,
        { $addToSet: { _meetups: meetup } },
        { new: true }
      )
        .then(updatedUser => {
          console.log(updatedUser);
          res.status(200).json("coucou");
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// remove a user from the meetup -- check
router.put("/delete-user", isLoggedIn, (req, res, next) => {
  const meetup = req.body.meetupid;
  const user = req.user._id;
  const currentUserId = req.user._id;
  console.log(meetup, "---");
  MeetUp.findByIdAndUpdate(meetup, { $pull: { _users: user } }, { new: true })
    .then(updatedMeetup => {
      console.log("heeeere");
      User.findByIdAndUpdate(
        user,
        { $pull: { _meetups: meetup } },
        { new: true }
      )
        .then(updatedUser => {
          console.log(updatedUser);
          res.status(200).json("coucou");
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
  // deleteIfAdminOrUserDeleted(meetupId, deleteUserId, currentUserId)
  //   .then(updatedMeetup => {
  //     res.json(updatedMeetup);
  //   })
  //   .catch(err => next(err));
});

router.patch("/edit/:meetupId", isLoggedIn, (req, res, next) => {
  console.log(req.body, req.params);
  const meetupId = req.params.meetupId;
  const changes = req.body;
  updateMeetup(meetupId, changes)
    .then(meetup => {
      res.json(meetup);
    })
    .catch(err => console.log(err));
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
  removeDuplicateSuggestionLocation(newLocation, meetupId)
    .then(createdLocation => {
      console.log("created a new location for a suggestion");
      const createdLocationId = createdLocation._id;
      addSuggestedLocation(meetupId, createdLocationId)
        .then(updatedMeetUp => {
          console.log("succesful addition of suggestion");
          res.json(createdLocation);
        })
        .catch(err => {
          console.log("error adding suggestion to meet up", err);
        });
    })
    .catch(err => console.log(err));
});

// add a depature location -- check
// make sure user only has one departure location
router.put("/departure-location/:meetupId", isLoggedIn, (req, res, next) => {
  const { lat, lng } = req.body;
  const meetupId = req.body.meetupId;
  console.log("body", req.body);
  const newLocation = {
    type_of_location: req.body.type_of,
    location: {
      coordinates: [lat, lng]
    },
    created_by: req.user._id
  };
  removeDuplicateDepartureLocation(newLocation, meetupId)
    .then(createdLocation => {
      console.log(
        "created location id and removed possible duplicate for user"
      );
      const createdLocationId = createdLocation._id;
      addDepartureLocation(meetupId, createdLocationId)
        .then(updatedMeetUp => {
          console.log("meetup updated with new departure location");
          res.json(createdLocation);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err, "removing the departure location"));
});

// remove suggested location -- check
// make sure user only has one suggested location
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
router.put("/add-vote/:suggestionId", isLoggedIn, (req, res, next) => {
  const locationId = req.params.suggestionId;
  const userId = req.user._id;
  addVote(locationId, userId)
    .then(updatedLocation => res.json({ msg: "vote was added!" }))
    .catch(err => console.log(err));
});

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

async function createMeetUp(
  _admin,
  _users,
  meetup_date,
  meetup_time,
  name,
  departureId
) {
  const newMeetUp = {
    _admin,
    _users,
    meetup_date,
    meetup_time,
    name,
    _departure_locations: departureId
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
    { new: true }
  );
  return createdMeetUp;
}

async function addSuggestedLocation(meetupId, createdLocationId) {
  const updatedMeetup = await MeetUp.findByIdAndUpdate(
    meetupId,
    {
      $addToSet: {
        _suggested_locations: createdLocationId
      }
    },
    { new: true }
  );
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
  if (meetup._departure_locations.length > 0) {
    meetup._departure_locations.forEach(loc => {
      if (loc.created_by.equals(departureCreator)) {
        duplicateDepartureId = loc._id;
        return;
      }
    });
  } else {
    return createdLocation;
  }
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
    return createdLocation;
  }
  return createdLocation;
}

async function createDepartureLocation(newLocation) {
  const createdLocation = await Location.create(newLocation);
  console.log("new departure created", newLocation);
  return createdLocation;
}

async function removeDuplicateSuggestionLocation(newLocation, meetupId) {
  const suggestionCreator = newLocation.created_by;
  const Meetup = await MeetUp.findById(meetupId).populate(
    "_suggested_locations"
  );
  const CurrentSuggestions = Meetup._suggested_locations;
  let idOfSuggestionToRemove = null;
  if (CurrentSuggestions.length > 0) {
    CurrentSuggestions.forEach(suggestion => {
      if (suggestion.created_by.equals(suggestionCreator)) {
        idOfSuggestionToRemove = suggestion._id;
        return;
      }
    });
  }
  if (idOfSuggestionToRemove) {
    const updatedMeetUp = await MeetUp.findByIdAndUpdate(
      meetupId,
      {
        $pull: {
          _suggested_locations: idOfSuggestionToRemove
        }
      },
      { new: true }
    );
  }
  const createdLocation = await Location.create(newLocation);
  return createdLocation;
}

async function updateMeetup(meetupId, changes) {
  console.log(
    meetupId,
    changes,
    "------------------------------------------------------*************************--------------------------------------"
  );
  const options = { new: true };
  try {
    const updatedMeetup = await MeetUp.findByIdAndUpdate(
      meetupId,
      changes,
      options
    );
    return updatedMeetup;
  } catch (err) {
    return alert(err);
  }
}

module.exports = router;
