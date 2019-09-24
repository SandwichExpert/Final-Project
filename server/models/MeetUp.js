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

const shema = new Schema(
  {
    // an array of users
    _users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    meetup_date: { type: String, required: true },
    meetup_time: { type: String, required: true },
    suggested_locations: [
      {
        name: String,
        location: { type: pointSchema, required: true },
        type_of_location: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', this.schema)
