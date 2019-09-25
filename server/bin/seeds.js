const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const MeetUp = require('../models')

const bcryptSalt = 10

// make a mongodb connection
require('../configs/database')

let userDocs = [
  new User({
    first_name: 'alice',
    last_name: 'something',
    email: 'alice@gmail.com',
    password: bcrypt.hashSync('alice', bcrypt.genSaltSync(bcryptSalt)),
  }),
  new User({
    first_name: 'bob',
    last_name: 'something',
    email: 'bob@gmail.com',
    password: bcrypt.hashSync('bob', bcrypt.genSaltSync(bcryptSalt)),
  }),
]

async function getAll() {
  await User.deleteMany()
  return 'all good'
}

async function feedDB() {
  await User.create(userDocs)
  return 'all good'
}

getAll().then(Msg => {
  console.log(Msg, ' full delete')
  feedDB().then(Msg => {
    console.log(Msg, ' database has been fed')
    console.log(`${userDocs.length} users created`)
    mongoose.disconnect()
  })
})
