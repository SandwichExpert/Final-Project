const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, done) => {
      console.log('here', username)
      User.findOne({ email: username })
        .then(foundUser => {
          if (!foundUser) {
            done(null, false, { message: 'Invalid email or password' })
            console.log('here.....')
            return
          }

          if (!bcrypt.compareSync(password, foundUser.password)) {
            done(null, false, { message: 'Invalid email or password' })
            return
          }
          console.log('here.....')

          done(null, foundUser)
        })
        .catch(err => done(err))
    }
  )
)
