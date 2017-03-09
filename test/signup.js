/**
 * Created by ren on 09/03/2017.
 */
'use strict';
var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../index');
var User = require('../lib/mongo').User;

var testName1 = 'testName1';
var testName2 = 'nswmw';
describe('signup', () => {
  describe('POST /signup', () => {
    var agent = request.agent(app);
    beforeEach((done) => {
      //创建一个用户
      User.create({
        name: testName1,
        password: '123456',
        avatar: '',
        gender: 'x',
        bio: ''
      })
        .exec()
        .then(() => {
          done();
        })
        .catch(done);
    });
    afterEach((done) => {
      // 删除测试用户
      User.remove({name: {$in: [testName1, testName2]}})
        .exec()
        .then(function () {
          done();
        })
        .catch(done);
    });
    it('wring name', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: ''})
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/名字请限制在1-10个字符/));
          done();
        })
    });
    // 性别错误的情况
    it('wrong gender', function (done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: testName2, gender: 'a'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err);
          assert(res.text.match(/性别只能是 m、f 或 x/));
          done();
        });
    });
    // 其余的参数测试自行补充
    // 用户名被占用的情况
    it('duplicate name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: testName1, gender: 'm', bio: 'noder', password: '123456', repassword: '123456'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err);
          assert(res.text.match(/用户名已被占用/));
          done();
        });
    });

    // 注册成功的情况
    it('success', function (done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: testName2, gender: 'm', bio: 'noder', password: '123456', repassword: '123456'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err);
          assert(res.text.match(/注册成功/));
          done();
        });
    });

  });

})