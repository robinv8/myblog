/**
 * Created by ren on 2017/3/7.
 */
"use strict";
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.redirect('/posts');
  });
  app.use('/signup', require('./signup'));
  app.use('/signIn', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/posts', require('./posts'));

  app.use((req, res) => {
    if (!res.headersSent) {
      return res.status(404).render('404')
    }
  });
};