var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var status = require('./routes/status');
var showdata = require('./routes/showdata');
var detectgesture = require('./routes/detectgesture');
var training = require('./routes/training');

var app = express();

var http = require('http');
app.set('port', 3000);
var server = http.createServer(app);
var io = require('socket.io')(server);

var globalsocket = null;

server.listen(3000);

io.on('connection', function (socket) {
  // console.log("new users");
  globalsocket = socket;
  // socket.emit('identification',{});
  socket.on('gesture', function (data) {
    console.log(data);
    socket.broadcast.emit('gesture', { gestureID: data });
    // socket.to('others').emit('gesture', { gestureID: data });
  });

});


// SGs
app.locals.SGs = {
  calibrationBase : [512,512,512,512,512,512,512,512,512],//500,500,500,500,500,500,500,500,500
  currentValue : [512,512,512,512,512,512,512,512,512]
} 


// Serial
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
// serialport.list(function (err, ports) {
//   ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

// 14CP0109
app.locals.sp = new SerialPort("/dev/cu.usbserial-AI02SSRK", {
  parser: serialport.parsers.readline("\n"),
  baudrate: 38400
});

app.locals.sp.on("data", function (msg) {
  var receivedString = String(msg);
  handlerForNewData(receivedString);
})

var handlerForNewData = function(datas) {
  var storeDataToArray = datas.split(" ");
  if (storeDataToArray.length == 11)
  {
    // console.log(datas);
    for (var i = 1; i <= 9; i++) {
      app.locals.SGs.currentValue[i-1] = parseInt(storeDataToArray[i]);
    };
    app.locals.SGs.currentValue[0] = parseInt((app.locals.SGs.currentValue[3] + app.locals.SGs.currentValue[4])/2);
    // app.locals.SGs.currentValue[1] = parseInt((app.locals.SGs.currentValue[2] + app.locals.SGs.currentValue[3] + app.locals.SGs.currentValue[4] + app.locals.SGs.currentValue[5])/4);
    // app.locals.SGs.currentValue[7] = parseInt((app.locals.SGs.currentValue[3] + app.locals.SGs.currentValue[4] + app.locals.SGs.currentValue[5] + app.locals.SGs.currentValue[6] + app.locals.SGs.currentValue[8])/5);
  };
  if (globalsocket !=null) {
    globalsocket.broadcast.emit('SGdata', { data: app.locals.SGs.currentValue});
    globalsocket.emit('SGdata', { data: app.locals.SGs.currentValue});
  };
  
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/SGValues', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('_SGValues(\'{"values": "'+ app.locals.SGs.currentValue + '"}\')');
});

app.get('/reopenPort', function(req, res){
  console.log("reopening");
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  app.locals.sp.close(function (error) {
    console.log("openNow");
    app.locals.sp.open(function (error) {
       if ( error ) {
          console.log('failed to open: '+error);
        } else {
          console.log('open');
        }
    });
  });

});

app.use('/status', status);
app.use('/showdata', showdata);
app.use('/detectgesture', detectgesture);
app.use('/training',training);
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
