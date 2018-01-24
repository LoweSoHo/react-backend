var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var questions = require('./routes/questions');
var quizzes = require('./routes/quizzes');
var knex = require('./db/knex');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.NODE_ENV !== "test") {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/questions', questions);
app.use('/quizzes', quizzes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* original scaffolding version
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

*/

// Adapted for Objection 
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || err.statusCode || 500);
    res.json({Success: false, message: JSON.parse(err.message), error: err});
  });
}

app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || err.statusCode || 500);
  res.json({Success: false, message: JSON.parse(err.message), error: {}});
});

module.exports = app;
