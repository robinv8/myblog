/**
 * Created by ren on 2017/3/7.
 */
'use strict';
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signin');
});
router.post('/', checkNotLogin, (req, res, next) => {
  var name = req.fields.name;
  var password = req.fields.password;

  UserModel.getUserByName(name)
    .then((user) => {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('back');
      }
      //检查密码是否匹配
      if (sha1(password) !== user.password) {
        req.flash('error', '用户名或密码错误');
        return res.redirect('back');
      }

      req.flash('success', '登录成功');
      delete user.password;
      req.session.user = user;
      res.redirect('/posts');
    }).catch(next);
});
module.exports = router;