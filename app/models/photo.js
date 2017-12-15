'use strict'

const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: false
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

// photoSchema.virtual('length').get(function length () {
//   return this.text.length
// })

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo
