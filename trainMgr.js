var app = require('./app.js');
var fs = require('fs');
var so = require('stringify-object');
var svm = require('node-svm');


var trainMgr = {
	filePath : null,
	folder : null,
	data: null,
	norm_data : null,
	init: function (folder)
	{
		this.folder = folder;
		this.filePath = "."+ folder + 'data.json';
		var file = fs.readFileSync(this.filePath);
		this.data = JSON.parse(file);
	},
	equalLength: function () {
		var finalOutput = [];

		for (var i = 0; i < this.data.length; i++) {
			var step = this.data[i]['data'].length/300.0;
			console.log(step);
			var currentStep = 0.0;
			var normalizedData = [];
			
			for (var j = 0; j < 300; j++) {
				normalizedData.push(this.data[i]['data'][Math.floor(currentStep)]);
				currentStep += step;
			};

			var outputJSON = {'type': this.data[i]['type'], 'data': normalizedData};
			finalOutput.push(outputJSON);
		};
		this.norm_data = finalOutput;
		var configJSON = JSON.stringify(finalOutput);
		fs.writeFileSync("."+ this.folder + "data_normalized.json", configJSON);
	},
	train: function () {
		
	}
}

module.exports = trainMgr;