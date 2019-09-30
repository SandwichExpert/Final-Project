const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    city: String,
    avatar: {
      type: String,
      default: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
    },
    background_image:{
      type:String,
      default:'https://wallpaperaccess.com/full/97836.jpg',
    },
    email: String,
    password: String,
    _friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // pending_friends:[{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _meetups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MeetUp' }],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
module.exports = User
