const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    type_of_location: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number],
    },
    created_by:{type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true},
    votes : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },

  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Location', schema)
