/**
 * Created by ren on 2017/3/8.
 */
'use strict';
var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
router.get('/', checkLogin, (req, res, next) => {
  req.session.user=null;
  req.flash('success','登出成功');
  res.redirect('/posts');
});

module.exports = router;