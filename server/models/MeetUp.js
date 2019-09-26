const mongoose = require('mongoose')
const Schema = mongoose.Schema
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
})

const schema = new Schema(
  {
    // an array of users
    name: { type: String, required: true },
    _admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    _users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    meetup_date: { type: String, required: true },
    meetup_time: { type: String, required: true },
    suggested_locations: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('MeetUp', schema)
