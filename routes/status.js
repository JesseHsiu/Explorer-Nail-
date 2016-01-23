var express = require('express');
var router = express.Router();

var saveMgr = require('./../saveMgr.js');

var stateMachine = {
  IDLE: 0,
  RECORDING: 1,
};

var state = stateMachine.IDLE;
var instance = null;
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('status', { title: 'Record' });
});

router.get('/start/:filename', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();

  console.log("get: " + req.params.filename);
  saveMgr.init('/public/data/' , req.params.filename, true);
  
  state = stateMachine.RECORDING;
  instance = req.app.locals.sp.on("data", function (msg) {
	 if (state == stateMachine.RECORDING) {saveData(msg)};
  });
});

router.get('/end', function(req, res, next) {
  instance = null;
  state = stateMachine.IDLE;

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  saveMgr.endOfWriting();
});

var saveData = function(datas) {	
  var storeDataToArray = datas.split(" ");
  // console.log(storeDataToArray);
  if (storeDataToArray.length == 11)
  {
    saveMgr.writeData(datas);
  };  
};

module.exports = router;
