/**
 * Created by ren on 2017/3/7.
 */
'use strict';
var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', (req, res, next) => {
  res.render('posts');
});

router.post('/', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

router.get('/create', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

router.get('/:postId', (req, res, next) => {
  req.send(req.flash());
});

router.get('/:postId/edit', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

router.post('/:postId/edit', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

router.get('/:postId/remove', checkLogin, (req, res, next) => {
  res.send(req.flash());
})

router.post('/:postId/comment', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

router.get('/:postId/comment/:commentId/remove', checkLogin, (res, req, next) => {
  res.send(req.flash());
});
module.exports = router;

