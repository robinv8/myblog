/**
 * Created by ren on 2017/3/8.
 */
'use strict';
var config = require('config-lite');
var Mongolass = require('mongolass');
var moment = require('moment');
var objectIdtoTimestamp = require('objectid-to-timestamp');

var mongolass = new Mongolass();


mongolass.plugin('addCreatedAt', {
  afterFind: (results) => {
    results.forEach((item) => {
      item.create_at = moment(objectIdtoTimestamp(item._id)).format(('YYYY-MM-DD HH:mm'));
    });
    return results
  },
  afterFindOne: (result) => {
    if (result) {
      result.create_at = moment(objectIdtoTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});
mongolass.connect(config.mongodb);

//创建用户表
exports.User = mongolass.model('User', {
  name: {type: 'string'},
  password: {type: 'string'},
  avatar: {type: 'string'},
  gender: {type: 'string', enum: ['m', 'f', 'x']},
  bio: {type: 'string'}
});
exports.User.index({name: 1}, {unique: true}).exec();

//文章模型设计
exports.Post=mongolass.model('Post',{
  author:{type:Mongolass.Types.ObjectId},
  title:{type:'string'},
  content:{type:'string'},
  pv:{type:'number'}
});
exports.Post.index({
  author:1,_id:-1
}).exec();//按照创建时间降序查看用户的文章列表