const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')
const uploader = require('../configs/cloudinary')

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

router.post('/signup', uploader.single('avatar'), (req, res, next) => {
  let avatar_url = ''
  req.file ? (avatar_url = req.file.url) : null
  const { email, password, first_name, last_name, city } = req.body
  if (!email || !password || !first_name || !last_name) {
    res.status(400).json({ message: 'fill in all required fields' })
    return
  }
  if (password.length < 4) {
    res
      .status(400)
      .json({ message: 'password must be at least 5 characters long' })
    return
  }
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc !== null) {
        res.status(409).json({ message: 'The email already exists' })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
      const newUser = new User({
        email,
        password: hashPass,
        first_name,
        last_name,
        avatar: avatar_url,
        city
      })
      return newUser.save()
    })
    .then(userSaved => {
      // LOG IN THIS USER
      // "req.logIn()" is a Passport method that calls "serializeUser()"
      // (that saves the USER ID in the session)
      req.logIn(userSaved, () => {
        // hide "encryptedPassword" before sending the JSON (it's a security risk)
        userSaved.password = undefined
        res.json(userSaved)
      })
    })
    .catch(err => next(err))
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong' })
      return
    }

    if (!theUser) {
      res.status(401).json({message:'Wrong email/password'})
      // failureDetails,
      return
    }

    // LOG IN THIS USER
    // "req.logIn()" is a Passport method that calls "serializeUser()"
    // (that saves the USER ID in the session)
    req.login(theUser, err => {
      // hide "encryptedPassword" before sending the JSON (it's a security risk)
      if (err) {
        res.status(500).json({ message: 'Something went wrong' })
        return
      }
      req.password = undefined
      // We are now logged in (notice req.user)
      res.json(req.user)
    })
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()
  res.json({ message: 'You are out!' })
})

module.exports = router

// router.post('/login', (req, res, next) => {
//   const { email, password } = req.body

//   // first check to see if there's a document with that email
//   User.findOne({ email })
//     .then(userDoc => {
//       // "userDoc" will be empty if the email is wrong (no document in database)
//       if (!userDoc) {
//         // create an error object to send to our error handler with "next()"
//         next(new Error('Incorrect email '))
//         return
//       }

//       // second check the password
//       // "compareSync()" will return false if the "password" is wrong
//       if (!bcrypt.compareSync(password, userDoc.password)) {
//         // create an error object to send to our error handler with "next()"
//         next(new Error('Password is wrong'))
//         return
//       }

//       // LOG IN THIS USER
//       // "req.logIn()" is a Passport method that calls "serializeUser()"
//       // (that saves the USER ID in the session)
//       req.logIn(userDoc, () => {
//         // hide "encryptedPassword" before sending the JSON (it's a security risk)
//         userDoc.password = undefined
//         res.json(userDoc)
//       })
//     })
//     .catch(err => next(err))
// })
