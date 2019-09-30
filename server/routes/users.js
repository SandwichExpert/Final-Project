const User = require("../models/User");
const express = require("express");
const router = express.Router();
const uploader = require("../configs/cloudinary");

router
  .get("/", (req, res, next) => {
    const id = req.user._id;
    findUser(id)
      .then(user => {
        console.log("user requested", user);
        if (user) {
          user.password = undefined;
          res.json(user);
        } else {
          res.json({ msg: "user not found" });
        }
      })
      .catch(err => console.log(err));
  })
  .get("/friends/:friendid", (req, res, next) => {
    const id = req.user._id;
    findUser(id)
      .then(user => {
        console.log("user requested", user);
        if (user) {
          user.password = undefined;
          res.json(user);
        } else {
          res.json({ msg: "user not found" });
        }
      })
      .catch(err => console.log(err));
  })

  .delete("/", (req, res, next) => {
    const id = req.user._id;
    deleteUser(id)
      .then(user => {
        console.log("user deleted");
        user.password = undefined;
        res.json(user);
      })
      .catch(err => console.log(err));
  })

  // .put("/changeBackground", uploader.single)

  // .put('/edit/:imageType',uploader.single(req.params.imageType),
  // (req, res, next)=> {
  //   // console.log(changes,"Those are the changes")
  //     // console.log(id,'this should be the user id')
  //     let changes = {[req.params.imageType]: req.file.url}
  //     console.log(changes);
  //     updateUser(id, changes)
  //     .then(user => {
  //       console.log("user updated");
  //       user.password = undefined;
  //       res.json(user);
  //     })
  //     .catch(err => console.log(err));

  // } )

  .put(
    "/edit", 
    uploader.fields([{name:"avatar",maxCount:1},{name:"background_image",maxCount:1}]),
    (req, res, next) => {
      let changes = req.body;
      const id = req.user._id;
      
      if(req.files["background_image"]){
        changes.background_image = req.files["background_image"][0].url
      }
      if(req.files["avatar"]){
        changes.avatar = req.files["avatar"][0].url;
      }
      
      console.log(req.files, "***********************************");
      updateUser(id, changes)
        .then(user => {
          console.log("user updated");
          user.password = undefined;
          res.json(user);
        })
        .catch(err => console.log(err));
    }
  )
  .put("/addFriend", (req, res, next) => {
    const email = req.body.email;
    // console.log(req.user, "----------", email);
    const userId = req.user._id;
    addFriendToUser(userId, email).then(user => {
      console.log("friend was added to user");
      res.json(user);
    });
  })
  .put("/removeFriend/:friendId", (req, res, next) => {
    const userId = req.user._id;
    const friendId = req.params.friendId;
    removeFriendFromUser(userId, friendId)
      .then(user => {
        res.json(user);
      })
      .catch(err => console.log("err", err));
  });

async function findUser(id) {
  try {
    const foundUser = await User.findById(id)
      .populate("_friends")
      .populate("_meetups");
    return foundUser;
  } catch (err) {
    return res.json({ msg: "user not found" });
  }
}

async function deleteUser(id) {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  } catch (err) {
    return alert(err);
  }
}

async function updateUser(id, changes) {
  console.log(id, changes);
  const options = { new: true };
  try {
    const updatedUser = await User.findByIdAndUpdate(id, changes, options);
    return updatedUser;
  } catch (err) {
    return alert(err);
  }
}

async function addFriendToUser(userId, email) {
  console.log("email: ", email);
  const friend = await User.findOne({ email });
  console.log("friend: ", friend);
  const friendId = friend._id;
  await User.findByIdAndUpdate(
    friendId,
    {
      $push: { _friends: userId }
    },
    { new: true }
  );
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $push: { _friends: friendId }
    },
    { new: true }
  );
  return updatedUser;
}

async function removeFriendFromUser(userId, friendId) {
  await User.findByIdAndUpdate(
    friendId,
    {
      $pull: { _friends: userId }
    },
    { new: true }
  );
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { _friends: friendId }
    },
    { new: true }
  );
  return updatedUser;
}

module.exports = router;
