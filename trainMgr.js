var app = require('./app.js');
var fs = require('fs');
var so = require('stringify-object');
var svm = require('node-svm');
var shell = require('shelljs');


var trainMgr = {
	filePath : null,
	folder : null,
	data: null,
	norm_data : null,
	dataLength : 50.0,
	init: function (folder)
	{
		this.folder = folder;
		this.filePath = "."+ folder + 'data.json';
		var file = fs.readFileSync(this.filePath);
		this.data = JSON.parse(file);
	},

	train: function(){
		var processedData = this.processDataByTime();
		this.trainSVM(processedData);
	},
	clearModel: function(){
		shell.rm('./data/ML/mlFiles/train.csv');
		shell.rm('./data/ML/mlFiles/train.ml');
	},
	processDataByTime: function (){
		var sg_count = this.data[0]['data'][0].length;
		var trainingSetWithLable = [];

		for (var i = 0; i < this.data.length; i++) {
			var lengthOfRawData = this.data[i]['data'].length;
			var trainingSet = new Array(18);

			for (var j = 0; j < trainingSet.length; j++) {
				trainingSet[j] = 0;
			};

			for (var j = 0; j < sg_count; j++) {
				var middle = Math.floor(lengthOfRawData / 2);
				for (var k = 0; k < this.data[i]['data'].length; k++) {
					
					console.log(this.data[i]['data'][k][j]);
					if (this.data[i]['data'][k][j] >= 0)
					{
						trainingSet[j*2] += Math.abs(this.data[i]['data'][k][j]);
					}
					else{
						trainingSet[j*2 + 1] += Math.abs(this.data[i]['data'][k][j]);
					}
				};	
			};
			console.log([ trainingSet ,this.transferNameToId(this.data[i]['type'])]);
			trainingSetWithLable.push([ trainingSet ,this.transferNameToId(this.data[i]['type'])])
		}

		return trainingSetWithLable;
	},
	equalLength: function () {
		var finalOutput = [];

		for (var i = 0; i < this.data.length; i++) {
			var step = this.data[i]['data'].length/this.dataLength;
			// console.log(step);
			var currentStep = 0.0;
			var normalizedData = [];
			
			for (var j = 0; j < Math.floor(this.dataLength); j++) {
				normalizedData.push(this.data[i]['data'][Math.floor(currentStep)]);
				currentStep += step;
			};

			var outputJSON = {'type': this.data[i]['type'], 'data': normalizedData};
			finalOutput.push(outputJSON);
		};
		this.norm_data = finalOutput;
		var configJSON = JSON.stringify(finalOutput);
		fs.writeFileSync("."+ this.folder + "data_normalized.json");
		// this.processData();
	},
	processData: function () {

		var sg_count = this.norm_data[0]['data'][0].length;

		var trainingSetWithLable = [];

		// for (var i = 0; i < trainingSet.length; i++) {
		// 	trainingSet[i] = [];
		// };

		for (var k = 0; k < this.norm_data.length; k++) {
			var trainingSet = [];
			for (var j = 0; j < sg_count; j++) {
				for (var i = 0; i < Math.floor(this.dataLength); i++) {
				
					trainingSet.push(this.norm_data[k]['data'][i][j])
				};	
			};
			console.log([ trainingSet ,this.transferNameToId(this.norm_data[k]['type'])]);
			trainingSetWithLable.push([ trainingSet ,this.transferNameToId(this.norm_data[k]['type'])])
			// var eachdataForSGs = new Array(sg_count);

			// for (var j = 0; j < eachdataForSGs.length; j++) {
			// 	eachdataForSGs[j] = [];
			// };

			// for (var j = 0; j < Math.floor(this.dataLength); j++) {
			// 	for (var k = 0; k < sg_count; k++) {
			// 		eachdataForSGs[k].push(this.norm_data[i]['data'][j][k]);
			// 	};	
			// }

			// for (var j = 0; j < sg_count; j++) {
			// 	trainingSet.push([eachdataForSGs[j] ,this.transferNameToId(this.norm_data[i]['type'])]);
			// };
		};
		return trainingSetWithLable;
		
		// this.trainOneByOne(trainingSet, 0);
	},
	trainSVM: function(trainingSet)
	{
		for (var i = 0; i < trainingSet.length; i++) {
			
			// Data
			for (var j = 0; j < trainingSet[i][0].length; j++) {
				fs.appendFileSync( "./data/ML/mlFiles/train.csv",(trainingSet[i][0][j]).toString() + ",");
			};

			// Label
			fs.appendFileSync( "./data/ML/mlFiles/train.csv",(trainingSet[i][1]).toString() + "\n");
		};


		shell.cd('data');
		shell.cd('ML');
		shell.cd('mlFiles');
		shell.exec('python csv2libsvm.py train.csv', {silent:true,async:false});
		shell.cd('..')
		shell.cd('..')
		shell.cd('..')
		// var clf = new svm.SVM({
			
		// 	svmType: 'C_SVC',
		//     // c: [2], 
		//     // kernels parameters 
		//     kernelType: 'POLY',
		    
		//     reduce : false,
		//     probability : true,
		//     // gamma: [0.0078125],

		// });

		// clf.train(trainingSet)
		// 	.progress(function(progress){
		// 		console.log('training progress: %d%', Math.round(progress*100));
		// 	})
		// 	.spread(function (model, report) {
		// 		console.log();
		// 		fs.writeFileSync("./data/models/model.json" ,JSON.stringify(model))
		// 		fs.writeFileSync('./data/models/accuracy.txt', report['accuracy'] + '\n');
		// 		console.log('training report: %s', so(report));

		// 		var prediction = clf.predictSync([ 0,
  //   0.49489795918367346,
  //   1199.6581632653067,
  //   313.35204081632656,
  //   1706.7908163265304,
  //   4887.576530612249,
  //   11650.47448979592,
  //   3492.005102040818,
  //   2219.836734693879,
  //   274.6479591836737,
  //   8650.204081632648,
  //   502.8112244897962,
  //   1292.0918367346937,
  //   604.2653061224489,
  //   0,
  //   3.3418367346938775,
  //   81.29591836734691,
  //   19434.520408163273 ]);

		// 		console.log(prediction);
		// 	});


	},
	trainOneByOne: function (trainingSet, index) {
		if (index > trainingSet.length) {
			console.log('Done Training');
			return
		};

		var self = this;
		var clf = new svm.SVM({
			
			svmType: 'C_SVC',
		    // c: [2], 
		    // kernels parameters 
		    kernelType: 'RBF',
		    // gamma: [0.0078125],

		});
		clf.train(trainingSet[index])
			.progress(function(progress){
				console.log(' %d - training progress: %d%', index ,Math.round(progress*100));
			})
			.spread(function (model, report) {
				console.log();
				fs.writeFileSync("./data/models/model"+ index.toString() +".json" ,so(model))
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