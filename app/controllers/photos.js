'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Photo = models.photo

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Photo.find()
    .then(photos => res.json({
      photos: photos.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    photo: req.photo.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  const photo = Object.assign(req.body.photo, {
    _owner: req.user._id
  })
  Photo.create(photo)
    .then(photo =>
      res.status(201)
        .json({
          photo: photo.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.photo._owner  // disallow owner reassignment.

  req.photo.update(req.body.photo)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.photo.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Photo), only: ['show'] },
  { method: setModel(Photo, { forUser: true }), only: ['update', 'destroy'] }
] })
