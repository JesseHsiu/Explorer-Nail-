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
	tmpForDifferenct : [],
	init: function (dataPort)
	{//dataPort
		this.dataPort = dataPort;
		this.dataToPredict = [];

		var files = glob.sync("./data/models/*.json");

		for (var i = 0; i < files.length; i++) {
			var data = fs.readFileSync(files[i]);
			this.predicter[i] = svm.restore(JSON.parse(data));
			// console.log(this.predicter[i]);
		};


		// var tmp = [];

		// for (var i = 0; i < 300; i++) {
		// 	tmp.push(0.5185546875);
		// };

		// console.log(this.predicter[1].predictSync(tmp));

		var accuracies = fs.readFileSync('./data/models/accuracy.txt').toString().split("\n");
		
		for (var i = 0; i < accuracies.length-1; i++) {
			this.validatedModel[i] = accuracies[i];
			// if (parseFloat(accuracies[i]) > 0.8)
			// {
			// 	console.log('good');
				
			// }
			// else{
			// 	console.log('bad');
			// 	this.validatedModel[i] = false;
			// }
		};

	},
	predict: function () {
		
		var norm_data = this.normalizeData();
		var array = this.dataByOneSG(norm_data);
		
		for (var i = 0; i < 9; i++) {//Probabilities
			var predictionLabel = this.predicter[i].predictSync(array[i]);
			var prediction = this.predicter[i].predictProbabilitiesSync(array[i]);
			
			if (this.validatedModel[i] > 0.8)
			{
				console.log(predictionLabel + " -> " + so(prediction));
			}
			else
			{
				console.log("not validated");
			}
		};
		this.dataToPredict = [];
		this.tmpForDifferenct = [];

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
		// console.log(array[1]);

		return array;
		
	},
	normalizeData: function () {
		
		var step = this.dataToPredict.length/300.0;
		var currentStep = 0.0;
		var normalizedData = [];
		
		for (var j = 0; j < 300; j++) {
			normalizedData.push(this.dataToPredict[Math.floor(currentStep)]);
			currentStep += step;
		};

		return normalizedData;
	},
	storeNeedToPredictData: function (data) {
		// console.log(base);

		// this.dataToStore.push(base);
		// console.log(base);
		needToStoreData = data.split(" ");
		if (this.tmpForDifferenct.length != 0)
		{
			var datas = [];
			for (var i = 1; i < needToStoreData.length-1; i++) {
				datas.push(needToStoreData[i] - this.tmpForDifferenct[i-1]);
			};
			console.log(datas);
			this.dataToPredict.push(datas);
		}
		else{
			var datas = [];
			for (var i = 1; i < needToStoreData.length-1; i++) {
				this.tmpForDifferenct.push(needToStoreData[i]);
			};
		}


		// if (this.tmpForDifferenct != null)
		// {
		// 	var datas = [];
		// 	for (var i = 1; i < needToStoreData.length-1; i++) {
		// 		datas.push(needToStoreData[i] - this.tmpForDifferenct[i-1]);
		// 	};
		// 	this.dataToPredict.push(datas);
		// };

		// this.tmpForDifferenct = base;
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