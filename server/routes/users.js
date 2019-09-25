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
  .put('/edit/:userid', uploader.single('avatar'), (req, res, next) => {
    let changes = req.body
    req.file ? (changes.avatar = req.file.url) : null
    const id = req.params.userid
    console.log(req.body)
    updateUser(id, changes)
      .then(user => {
        console.log('user updated')
        user.password = undefined
        res.json(user)
      })
      .catch(err => console.log(err))
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

module.exports = router
