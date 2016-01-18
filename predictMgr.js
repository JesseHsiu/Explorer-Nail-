var app = require('./app.js');
var fs = require('fs');
var so = require('stringify-object');
var svm = require('node-svm');
var glob = require("glob");

var predictMgr = {
	predicter : new Array(9),
	validatedModel : new Array(9),
	dataPort : null,
	dataToPredict : null,
	init: function (dataPort)
	{
		this.dataPort = dataPort;
		var self = this;
		glob("./data/models/*.json", function (er, files) {
			for (var i = 0; i < files.length; i++) {

				fs.readFile(files[i], function (err, data) {
					self.predicter[i] = svm.restore(JSON.parse(data));
					// self.predicter[i].evaluate;
				})
			};
		});
		var accuracies = fs.readFileSync('./data/models/accuracy.txt').toString().split("\n");
		
		for (var i = 0; i < accuracies.length-1; i++) {
			if (parseFloat(accuracies[i]) > 0.8)
			{
				console.log('good');
				validatedModel = true;
			}
			else{
				console.log('bad');
				validatedModel = false;
			}
		};

	},
	predict: function () {
		var norm_data = this.normalizeData();
		var array = this.dataByOneSG(norm_data);

		for (var i = 0; i < array.length; i++) {
			var prediction = this.predicter[i].predictSync(array[i]);
			console.log(this.transferIdToName(prediction));
		};

	},
	dataByOneSG : function (norm_data) {
		
		var array = new Array(9);

		for (var i = 0; i < array.length; i++) {
			array[i] = [];
		};

		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < norm_data.length; j++) {
				array[i].push(norm_data[j][i]);
			};
		};

		return array;
		
	},
	normalizeData: function () {
		var step = this.dataToPredict.length/300.0;
		
		var currentStep = 0.0;
		var normalizedData = [];
		
		for (var j = 0; j < 300; j++) {
			normalizedData.push(this.dataToPredict[i][Math.floor(currentStep)]);
			currentStep += step;
		};

		return normalizedData;
		
	},
	storeNeedToPredictData: function (data) {
		needToStoreData = data.split(" ");

		var datas = [];

		for (var i = 1; i < needToStoreData.length-1; i++) {
			datas.push(needToStoreData[i] - 512);
		};
		this.dataToPredict.push(datas);
	},
	collectDataOnPort: function () {
		this.dataPort.on('data',this.storeNeedToPredictData);

	},
	closeCollectionOnPort:function(){
		this.dataPort.removeListener("data", this.storeNeedToPredictData);
	},
	transferIdToName:function (type) {
		if (type == 0)
		{
			return "left";
		}
		else if(type == 1)
		{
			return "right";
		}
		else if(type == 2)
		{
			return "up";
		}
		else if(type == 3)
		{
			return "down";
		}
		else if(type == 4)
		{
			return "check";
		}
	}
}

module.exports = predictMgr;