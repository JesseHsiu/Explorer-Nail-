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
			// console.log(step);
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
		var self = this;
		fs.writeFile("."+ this.folder + "data_normalized.json", configJSON,function () {
			self.train();	
		});
	},
	train: function () {

		var sg_count = this.norm_data[0]['data'][0].length;

		var trainingSet = new Array(sg_count);

		for (var i = 0; i < trainingSet.length; i++) {
			trainingSet[i] = [];
		};

		for (var i = 0; i < this.norm_data.length; i++) {
			var eachdataForSGs = new Array(sg_count);

			for (var j = 0; j < eachdataForSGs.length; j++) {
				eachdataForSGs[j] = [];
			};

			for (var j = 0; j < 300; j++) {
				for (var k = 0; k < sg_count; k++) {
					eachdataForSGs[k].push(this.norm_data[i]['data'][j][k]);
				};	
			}

			for (var j = 0; j < sg_count; j++) {
				trainingSet[j].push([eachdataForSGs[j] ,this.transferNameToId(this.norm_data[i]['type'])]);
			};
		};
		this.trainOneByOne(trainingSet, 0);
	},
	trainOneByOne: function (trainingSet, index) {
		if (index > trainingSet.length) {
			console.log('Done Training');
			return
		};

		var self = this;
		var clf = new svm.CSVC();
		clf.train(trainingSet[index])
			.progress(function(progress){
				console.log(' %d - training progress: %d%', index ,Math.round(progress*100));
			})
			.spread(function (model, report) {
				console.log();
				fs.writeFileSync("./data/models/model"+ index.toString() +".json" ,JSON.stringify(model))
				fs.appendFile('./data/models/accuracy.txt', report['accuracy'] + '\n');
				console.log('training report: %s', so(report['accuracy']));
				self.trainOneByOne(trainingSet, index+1);
			});
	},
	transferNameToId:function (type) {
		if (type == "left")
		{
			return 0;
		}
		else if(type == "right")
		{
			return 1;
		}
		else if(type == "up")
		{
			return 2;
		}
		else if(type == "down")
		{
			return 3;
		}
		else if(type == "check")
		{
			return 4;
		}
		
	}
}

module.exports = trainMgr;