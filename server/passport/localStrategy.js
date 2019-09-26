const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')

passport.use(
  new LocalStrategy(
    {
      UsernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      console.log('here', email)
      User.findOne({ email })
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
