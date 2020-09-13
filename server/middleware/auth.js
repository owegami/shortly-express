const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  Promise.resolve(req.cookies.shortlyid)
    .then((hashedCookie) => {
      if (!hashedCookie) {
        throw hashedCookie;
      }
      return models.Sessions.get({hashedCookie});
    })
    .tap((session) => {
      if (!session) {
        throw session;
      }
    })
    .catch(() => {
      return models.Sessions.create()
        .then (results => {
          return models.Sessions.get({id: results.insertId});
        })
        .tap((session) => {
          res.cookie('shortlyid', session.hash);
        });
    })
    .then((session) => {
      req.session = session;
      next();
    });

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

