var app = require('./app.js');
var fs = require('fs');
var so = require('stringify-object');
var svm = require('node-svm');
var shell = require('shelljs');
var path = require('path');
var stable = require('stable');
// var csv = require('csv');

var trainMgr = {
	filePath : null,
	folder : null,
	data: null,
	norm_data : null,
	dataLength : 10.0,
	init: function (folder)
	{
		this.folder = folder;
		this.filePath = "."+ folder + 'data.json';
		var file = fs.readFileSync(this.filePath);
		this.data = JSON.parse(file);
	},

	train: function(){
		// this.equalLength();
		



		var processedData = this.processDataByTime(3);
		this.trainSVM(processedData);

		this.crossValidation('./data/ML/mlFiles/train.ml',10);
	},
	clearModel: function(){
		shell.rm('./data/ML/mlFiles/train.csv');
		shell.rm('./data/ML/mlFiles/train.ml');
	},
	processDataByTime: function (numOfGroups){
		var sg_count = this.data[0]['data'][0].length;
		var trainingSetWithLable = [];

		for (var i = 0; i < this.data.length; i++) {
			var lengthOfRawData = this.data[i]['data'].length;
			var trainingSet = new Array(sg_count * 2 * numOfGroups);

			for (var j = 0; j < trainingSet.length; j++) {
				trainingSet[j] = 0;
			};

			for (var j = 0; j < sg_count; j++) {
				// var middle = Math.floor(lengthOfRawData / 2);
				for (var k = 0; k < lengthOfRawData; k++) {

					var indexOfGroup = Math.floor(k / (lengthOfRawData/numOfGroups))
					
					console.log(indexOfGroup);
					if (this.data[i]['data'][k][j] >= 0)
					{
						trainingSet[j*2 + sg_count*2 * indexOfGroup] += Math.abs(this.data[i]['data'][k][j]);
					}
					else{
						trainingSet[j*2 + 1 + sg_count*2 * indexOfGroup] += Math.abs(this.data[i]['data'][k][j]);
					}
				};	
			};
			// console.log([ trainingSet ,this.data[i]['type']]);
			trainingSetWithLable.push([ trainingSet ,this.data[i]['type']])
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
			console.log([ trainingSet ,this.norm_data[k]['type']]);
			trainingSetWithLable.push([ trainingSet ,this.norm_data[k]['type']])
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
		
	},

	crossValidation : function (filePath, numOfFolds){
		var twoDimArray = this.createOrganized2DArrayDataFromFile(filePath);
		this.createFoldsValidationFiles(filePath, numOfFolds, twoDimArray);

		var pathParse = path.parse(filePath);

		// shell.cd('./data/ML/mlFiles');
		// for (var i = 0; i < numOfFolds; i++) {
		// 	var trainFilePath = pathParse.name + i + pathParse.ext;
		// 	var predictFilePath = "predict" + i + pathParse.ext;

		// 	shell.exec('python easy.py ' + trainFilePath + ' ' + predictFilePath, {silent:false,async:false});
		// };
		// shell.cd('../../..');

		var finalResult = this.computeResults(filePath, numOfFolds, twoDimArray);
		console.log("finalResult.accuracy = " + finalResult.accuracy);
		this.outputConfusionMat(pathParse.dir, "confusionMatrix.csv", finalResult.confusionMat);
		return finalResult;
	},

	readFileWithEachLineIntoArray : function(filePath){
		var lines = fs.readFileSync(filePath, 'utf8').split('\n');

		if (typeof lines[lines.length-1][0] === 'undefined') {
			lines.splice(lines.length-1, 1);
		};
		return lines;
	},

	createOrganized2DArrayDataFromFile : function(filePath){
		var lines = this.readFileWithEachLineIntoArray(filePath);

		return this.get2DArrayDataFromDataLines(lines);
	},

	get2DArrayDataFromDataLines : function(lines){
		var twoDimArray = [];
		var sortedLines = stable(lines, function(a, b){return parseInt(a.split(' ')[0]) > parseInt(b.split(' ')[0]);});

		var currentLineLabel = parseInt(sortedLines[0].split(' ')[0]);
		var numOfElemOfLabel = 0;
		var i = 0;
		for (; i < sortedLines.length; i++) {
			if (parseInt(sortedLines[i].split(' ')[0]) != currentLineLabel) {
				currentLineLabel = parseInt(sortedLines[i].split(' ')[0]);
				twoDimArray.push(sortedLines.slice(i - numOfElemOfLabel, i));
				numOfElemOfLabel = 0;
			};
			numOfElemOfLabel++;
		};

		twoDimArray.push(sortedLines.slice(i - numOfElemOfLabel, i));
		// console.log(twoDimArray);
		return twoDimArray;
	},

	createFoldsValidationFiles : function (filePath, numOfFolds, twoDimArray) {
		var pathParse = path.parse(filePath);

		for (var i = 0; i < numOfFolds; i++) {
			var trainFilePath = path.join(pathParse.dir, pathParse.name + i + pathParse.ext);
			var predictFilePath = path.join(pathParse.dir, "predict" + i + pathParse.ext);
			var foldData = this.getTrainAndPredictFoldData(i, numOfFolds, twoDimArray);
			// console.log(foldData);

			// var trainWriteFile = fs.createWriteStream(trainFilePath);
			// var predictWriteFile = fs.createWriteStream(predictFilePath);
			// trainWriteFile.on('error', function(err){});
			// predictWriteFile.on('error', function(err){});

			// foldData.train.forEach(function(v){trainWriteFile.write(v + '\n');});
			// foldData.predict.forEach(function(v){predictWriteFile.write(v + '\n');});

			// trainWriteFile.end();
			// predictWriteFile.end();
			if (fs.existsSync(trainFilePath)) {shell.rm(trainFilePath)};
			if (fs.existsSync(predictFilePath)) {shell.rm(predictFilePath)};
			foldData.train.forEach(function(v){fs.appendFileSync(trainFilePath, v + '\n')});
			foldData.predict.forEach(function(v){fs.appendFileSync(predictFilePath, v + '\n')});
		};
	},

	getTrainAndPredictFoldData : function(nthFold, numOfFolds, twoDimArray){
		var foldData = {"train" : [], "predict" : []};
		for (var i = 0; i < twoDimArray.length; i++) {
			var numOfPredictElem = twoDimArray[i].length/numOfFolds;
			var predictBeginIdx = Math.min(Math.floor(nthFold * numOfPredictElem), twoDimArray[i].length);
			var predictEndIdx = Math.min(Math.floor(nthFold * numOfPredictElem + numOfPredictElem), twoDimArray[i].length);
			var numOfTruePredictElem = predictEndIdx - predictBeginIdx;

			var shallowCopy = twoDimArray[i].slice();
			var predictData = shallowCopy.splice(predictBeginIdx, numOfTruePredictElem);

			foldData.train = foldData.train.concat(shallowCopy);
			foldData.predict = foldData.predict.concat(predictData);
		};

		return foldData;
	},

	computeResults : function (filePath, numOfFolds, twoDimArray){
		var pathParse = path.parse(filePath);
		var results = {"accuracy" : 0, "confusionMat" : this.zeros([twoDimArray.length, twoDimArray.length])};

		for (var i = 0; i < numOfFolds; i++) {
			var predictFilePath = path.join(pathParse.dir, "predict" + i + pathParse.ext);
			var predictResultFilePath = path.join(pathParse.dir, "predict" + i + pathParse.ext + ".predict");

			var predictFileLines = this.readFileWithEachLineIntoArray(predictFilePath);
			var predictResultFileLines = this.readFileWithEachLineIntoArray(predictResultFilePath);

			var matchCount = 0;
			for (var j = 0; j < predictFileLines.length; j++) {
				var predictLabel = parseInt(predictFileLines[j].split(' ')[0]);
				var predictResultLabel = parseInt(predictResultFileLines[j]);
				var predictLabelIdx = this.getIdxByLabelFrom2DArray(predictLabel, twoDimArray);
				var predictResultIdx = this.getIdxByLabelFrom2DArray(predictResultLabel, twoDimArray);

				if (predictLabel == predictResultLabel){
					matchCount++;
				};
				results.confusionMat[predictLabelIdx][predictResultIdx]++;
			};
			// console.log("matchCount " + matchCount);
			results.accuracy += matchCount/predictFileLines.length;
		};
		// console.log("results.confusionMat : \n" + results.confusionMat);
		results.accuracy /= numOfFolds;
		return results;
	},

	zeros : function (dimensions) {
		var array = [];

		for (var i = 0; i < dimensions[0]; ++i) {
			array.push(dimensions.length == 1 ? 0 : this.zeros(dimensions.slice(1)));
		}

	   return array;
	},

	getIdxByLabelFrom2DArray : function (label, twoDimArray){
		for (var i = 0; i < twoDimArray.length; i++) {
			if(parseInt(twoDimArray[i][0].split(' ')[0]) == label){
				return i;
			};
		};
	},

	outputConfusionMat : function (filePath, filename, confusionMat){
		var fullFileName = path.join(filePath, filename);
		
		// var writeFileStream = fs.createWriteStream(fullFileName);
		// writeFileStream.on('error', function (err){});

		// for (var i = 0; i < confusionMat.length; i++) {
		// 	for (var j = 0; j < confusionMat[i].length; j++) {
		// 		if (j == confusionMat[i].length - 1) {
		// 			writeFileStream.write(confusionMat[i][j]);
		// 			// console.log("if : " + confusionMat[i][j]);
		// 		} else {
		// 			writeFileStream.write(confusionMat[i][j] + ", ");
		// 			// console.log("else : " + confusionMat[i][j]);
		// 		};
		// 	};
		// 	writeFileStream.write('\n');
		// };
		// writeFileStream.end();

		var outputString = "";
		for (var i = 0; i < confusionMat.length; i++) {
			for (var j = 0; j < confusionMat[i].length; j++) {
				if (j == confusionMat[i].length - 1) {
					outputString += confusionMat[i][j];
				} else {
					outputString += confusionMat[i][j] + ", ";
				};
			};
			outputString += '\n';
		};
		fs.writeFileSync(fullFileName, outputString);
	}
}

// trainMgr.createFoldsValidationFiles("./data/ML/mlFiles/train.ml", 4);
// trainMgr.crossValidation("./data/ML/mlFiles/train.ml", 10);

module.exports = trainMgr;