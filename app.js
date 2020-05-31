var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var debug = require('debug')('express-movie:server');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var movieRouter = require('./routes/movie');
var newsRouter = require('./routes/news');
// RESTful API
var usersRouter = require('./routes/restful/users');
var moviesRouter = require('./routes/restful/movies');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express); // add html engine
app.set('view engine', 'html');               // use html engine

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// session middleware config
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
    },
}));
app.use(express.static(path.join(__dirname, 'public')));

// register site information
app.use((req, res, next) => {
    let siteConfig = require('./site.config');
    req._site = siteConfig;
    next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/movie', movieRouter);
app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err.message);
    debug(err.message);
    // render the error page
    let statusCode = err.status || 500;
    res.status(statusCode);
    if (statusCode == 404) {
        res.render('404', {
            site: req._site,
            session: req.session.mine,
        });
    } else {
        res.render('error', {
            site: req._site,
            session: req.session.mine,
        });
    }
});

module.exports = app;
