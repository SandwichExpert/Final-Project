const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    avatar: String,
    email: String,
    password: String,
    _friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
module.exports = User
