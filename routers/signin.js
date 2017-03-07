/**
 * Created by ren on 2017/3/7.
 */
'use strict';
var express = require('express');
var router = express.Router();

var checkNotLogin = require('../middlewares/check').checkNotLogin;
router.get('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
});
router.post('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
});
module.exports = router;