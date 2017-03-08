/**
 * Created by ren on 2017/3/8.
 */
'use strict';
var User = require('../lib/mongo').User;
module.exports = {
  //注册一个用户
  create: (user) => {
    return User.create(user).exec();
  },
  getUserByName:(name)=>{
    return User
      .findOne({name:name})
      .addCreatedAt()
      .exec();
  }
}