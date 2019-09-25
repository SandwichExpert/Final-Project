const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    avatar: { type: String, default: './static/media/default_avatar.png' },
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
