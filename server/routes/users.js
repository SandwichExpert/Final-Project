const User = require('../models/User')
const express = require('express')
const router = express.Router()
const uploader = require('../configs/cloudinary')

router
  .get('/:userid', (req, res, next) => {
    const id = req.params.userid
    findUser(id)
      .then(user => {
        console.log('user requested', user)
        if (user) {
          user.password = undefined
          res.json(user)
        } else {
          res.json({ msg: 'user not found' })
        }
      })
      .catch(err => console.log(err))
  })
  .get('/friends/:userid', (req, res, next) => {
    const id = req.params.userid
    findUserFriends.then(friends => {
      res.json({ friends })
    })
  })
  .delete('/:userid', (req, res, next) => {
    const id = req.params.userid
    deleteUser(id)
      .then(user => {
        console.log('user deleted')
        user.password = undefined
        res.json(user)
      })
      .catch(err => console.log(err))
  })
  .put('/edit', uploader.single('avatar'), (req, res, next) => {
    let changes = req.body
    req.file ? (changes.avatar = req.file.url) : null
    const id = req.user._id
    console.log(req.body)
    updateUser(id, changes)
      .then(user => {
        console.log('user updated')
        user.password = undefined
        res.json(user)
      })
      .catch(err => console.log(err))
  })
  .post('/addFriend', (req, res, next) => {
    const email = req.body.email
    const userId = req.user._id
    addFriendToUser(userId, email).then(user => {
      console.log('friend was added to user')
      res.json(user)
    })
  })
  .delete('/removeFriend/:friendId', (req, res, next) => {
    const userId = req.user._id
    const friendId = req.params.friendId
    removeFriendFromUser(userId, friendId)
      .then(user => {
        res.json(user)
      })
      .catch(err => console.log('err', err))
  })

async function findUser(id) {
  try {
    const foundUser = await User.findById(id)
    return foundUser
  } catch (err) {
    return res.json({ msg: 'user not found' })
  }
}

async function deleteUser(id) {
  try {
    const deletedUser = await User.findByIdAndDelete(id)
    return deletedUser
  } catch (err) {
    return alert(err)
  }
}

async function updateUser(id, changes) {
  const options = { new: true }
  try {
    const updatedUser = await User.findByIdAndUpdate(id, changes, options)
    return updatedUser
  } catch (err) {
    return alert(err)
  }
}

async function findUserFriends(id) {
  const user_with_full_friends = await User.findById(id).populate('_friends')
  const friends = user_with_full_friends._friends.map(friend => {
    return friend
  })
  return friends
}

async function addFriendToUser(userId, email) {
  const friend = await User.findOne({ email })
  const friendId = friend._id
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $push: { _friends: friendId },
    },
    { new: true }
  )
  return updatedUser
}

async function removeFriendFromUser(userId, friendId) {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { _friends: friendId },
    },
    { new: true }
  )
  return updatedUser
}

module.exports = router
