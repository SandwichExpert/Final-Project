const User = require('../models/User')
const express = require('express')
const router = express.Router()
const uploader = require('../configs/cloudinary')

router
  .get('/:userid', (req, res, next) => {
    const id = req.params.userid
    findUser(id).then(user => {
      console.log('user requested')
      res.json(user)
    })
  })
  .delete('/:userid', (req, res, next) => {
    const id = req.params.userid
    deleteUser(id).then(user => {
      console.log('user deleted')
      res.json(user)
    })
  })
  .post('/edit', uploader.single('avatar'), (req, res, next) => {
    deleteUser(id).then(user => {
      console.log('user deleted')
      res.json(user)
    })
  })

async function findUser(id) {
  const foundUser = await User.findById(id)
  return foundUser
}

async function deleteUser(id) {
  const deletedUser = await User.findByIdAndDelete(id)
  return deletedUser
}

async function updateUser(id) {
  const updateUser = await User.findByIdAndUpdate(id)
  return updatedUser
}

module.exports = router
