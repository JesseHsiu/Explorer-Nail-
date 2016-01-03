var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('detectgesture', { title: 'Detect Gesture' });
});


module.exports = router;
