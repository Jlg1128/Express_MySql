// @ts-ignore
const createError = require('http-errors');
// @ts-ignore
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const conf = require('./bin/db/conf/db');
const indexRouter = require('./routes/index');
const checkOutToken = require('./util/checkToken');
const usersRouter = require('./routes/users');

const router = express.Router();

const accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/request.log'),
{ flags: 'a', encoding: 'utf8' });

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

// app.use(logger('dev'));
app.use(logger('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('In');
    res.locals.connection = mysql.createConnection(conf);
    res.locals.connection.connect();
  console.log('out');
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

router.use(checkOutToken);

app.router = router;
app.name = 'jlg';

module.exports = app;
