const User = require('../models/User')
const express = require('express')
const router = express.Router()
const uploader = require('../configs/cloudinary')

router
  .get('/', (req, res, next) => {
    const id = req.user._id
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

  .delete('/', (req, res, next) => {
    const id = req.user._id
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
    const id = req.user._id
    req.file ? (changes.avatar = req.file.url) : null
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
    console.log(req.user, '----------', email)
    const userId = req.user._id
    addFriendToUser(userId, email).then(user => {
      console.log('friend was added to user')
      res.json(user)
    })
  })
  .put('/removeFriend/:friendId', (req, res, next) => {
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
      .populate('_friends')
      .populate('_meetups')
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

async function addFriendToUser(userId, email) {
  console.log('email: ', email)
  const friend = await User.findOne({ email })
  console.log('friend: ', friend)
  const friendId = friend._id
  await User.findByIdAndUpdate(
    friendId,
    {
      $push: { _friends: userId },
    },
    { new: true }
  )
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
  await User.findByIdAndUpdate(
    friendId,
    {
      $pull: { _friends: userId },
    },
    { new: true }
  )
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
