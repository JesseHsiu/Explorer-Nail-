var express = require('express');
var router = express.Router();
var shell = require('shelljs');

var saveMgr = require('./../saveMgr.js');
var trainMgr = require('./../trainMgr.js');
var stateMachine = {
  IDLE: 0,
  RECORDING: 1,
};

var state = stateMachine.IDLE;

router.get('/', function(req, res, next) {
	res.render('learning', { title: 'Learning' });
});

router.get('/start/:filename', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  console.log(req.params.filename);
  saveMgr.init('/data/training/',req.params.filename, false);
  
  state = stateMachine.RECORDING;
  req.app.locals.sp.on("data", recording);
});

function recording (msg) {
  if (state == stateMachine.RECORDING) {saveData(msg)};
}

router.get('/end', function(req, res, next) {
  // instance = null;
  req.app.locals.sp.removeListener("data", recording);
  state = stateMachine.IDLE;

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  saveMgr.writeEnd();
  saveMgr.endOfWriting();
});

router.get('/cleardata', function(req, res, next) {
  state = stateMachine.IDLE;

  shell.rm('./data/training/*');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
});

router.get('/trainCurrentData', function(req, res, next) {
  
  trainMgr.init('/data/training/');
  trainMgr.equalLength();
  
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
});

var saveData = function(datas) {	
  var storeDataToArray = datas.split(" ");
  if (storeDataToArray.length == 11)
  {
    saveMgr.writeData(datas);
  };  
};


module.exports = router;
