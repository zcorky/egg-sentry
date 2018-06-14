'use strict';

const Raven = require('raven');

module.exports = app => {
  const config = app.config.sentry;
  Raven.config(config.dsn, config.config).install();

  app.on('error', (err, ctx) => {
    ctx = ctx || app.createAnonymousContext();
  
    Raven.captureException(err, (err, eventId) => {
      const errmsg = 'Reported error: ' + eventId;
      try {
        ctx.logger.error(errmsg);
      } catch (ex) {
        app.logger.error(errmsg);
        app.logger.error(ex);
      }
    });
  });
};