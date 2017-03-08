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

exports.User = mongolass.model('User', {
  name: {type: 'string'},
  password: {type: 'string'},
  avatar: {type: 'string'},
  gender: {type: 'string', enum: ['m', 'f', 'x']},
  bio: {type: 'string'}
});
exports.User.index({name: 1}, {unique: true}).exec();