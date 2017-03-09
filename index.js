/**
 * Created by ren on 2017/3/7.
 */
"use strict";
var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routers = require('./routers');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url: config.mongodb
  })
}));

app.use(flash());

//处理表单及上传文件的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtenions: true//保留后缀
}))

app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});
app.use((err, req, res, next) => {
  res.render('error', {
    error: err
  });
});

app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
routers(app);
// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

if (module.parent) {
  module.exports = app;
} else {
  app.listen(config.port, () => {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}