'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const PgSite = models.pgSite

const authenticate = require('./concerns/authenticate')
// const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  PgSite.find()
    .then(pgSites => res.json({
      pgSites: pgSites.map((e) =>
        e.toJSON({ virtuals: true}))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    pgSite: req.pgSite.toJSON({ virtuals: true})
  })
}

const create = (req, res, next) => {
  const pgSite = Object.assign(req.body.pgSite, {
    _owner: req.user._id
  })
  PgSite.create(pgSite)
    .then(pgSite =>
      res.status(201)
        .json({
          pgSite: pgSite.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.pgSite._owner  // disallow owner reassignment.

  req.pgSite.update(req.body.pgSite)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.pgSite.remove()
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
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(PgSite), only: ['show'] },
  { method: setModel(PgSite, { forUser: true }), only: ['update', 'destroy'] }
] })
