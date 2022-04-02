var express = require('express');
var path = require('path');
const cors = require('cors');

var trajetsRouter = require('./routes/trajets')
var usersRouter = require('./routes/users');

var app = express();


app.use(
  cors({
    origin: "*"
  })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/utilisateur', usersRouter);
app.use('/trajet', trajetsRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return an error
  res.status(err.status || 500);
  res.json({ error: err});
});

module.exports = app;