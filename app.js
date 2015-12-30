var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// SGs
app.locals.SGs = {
  calibrationBase : [500,500,500,500,500,500,500,500,500],//500,500,500,500,500,500,500,500,500
  currentValue : [500,500,500,500,500,500,500,500,500]
} 

// Serial
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
// serialport.list(function (err, ports) {
//   ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });


var sp = new SerialPort("/dev/cu.usbserial-14CP0109", {
  parser: serialport.parsers.readline("\n"),
  baudrate: 38400
});

sp.on("data", function (msg) {
  var receivedString = String(msg);
  handlerForNewData(receivedString);
})

var handlerForNewData = function(datas) {
  var storeDataToArray = datas.split(" ");
  if (storeDataToArray.length == 11)
  {
    console.log(datas);
    for (var i = 1; i <= 9; i++) {
      app.locals.SGs.currentValue[i-1] = parseInt(storeDataToArray[i]);
    };
  };  
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/SGValues', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_SGValues(\'{"values": "'+ app.locals.SGs.currentValue + '"}\')');
});
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
