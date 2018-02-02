'use strict'

const mongoose = require('mongoose')

const pgSiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: false
  },
  maxWindDir: {
    type: Number,
    required: false
  },
  minWindDir: {
    type: Number,
    required: false
  },
  restrictions: {
    type: Array,
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
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

const PgSites = mongoose.model('PgSites', pgSiteSchema)

module.exports = PgSites
