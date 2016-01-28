var app = require('./app.js');
var fs = require('fs');
var csv = require("fast-csv");

var saveMgr = {
	csvStream : null,
	filename : null,
	writableStream : null,
	SGsBase : null,
	filePath : null,
	dataToStore : [],
	tmpForDifferenct : [],
	init: function (folder, filename, needHeader)
	{
		this.filePath = "."+ folder + "data.json";
		this.filename = filename;
		// this.writableStream = fs.createWriteStream(this.filePath);
		// this.csvStream = csv.createWriteStream({'headers': needHeader, 'flags': 'a'});
		// this.csvStream.pipe(this.writableStream);
	},
	deleteLastOne: function (){
		var configFile = fs.readFileSync(this.filePath);
		var config = JSON.parse(configFile);
		config.pop();
		var configJSON = JSON.stringify(config);
		fs.writeFileSync(this.filePath, configJSON);
	},
	writeData: function (data) {
		needToStoreData = data.split(" ");

		
		// console.log(base);

		// this.dataToStore.push(base);
		// console.log(base);

		if (this.tmpForDifferenct.length != 0)
		{
			var datas = [];
			for (var i = 1; i < needToStoreData.length-1; i++) {
				datas.push(needToStoreData[i] - this.tmpForDifferenct[i-1]);
			};
			console.log(datas);
			// console.log(needToStoreData[i] - this.tmpForDifferenct[i-1]);
			this.dataToStore.push(datas);
		}
		else{
			var datas = [];
			for (var i = 1; i < needToStoreData.length-1; i++) {
				this.tmpForDifferenct.push(needToStoreData[i]);
			};
		}

	},

	writeEnd: function (data) {
		// fs.appendFile(this.filePath, '\n', function (err) {

		// });
	},

	endOfWriting: function (){
		if (fs.existsSync(this.filePath))
		{
			var array = {'type': this.filename, 'data': this.dataToStore};	
			var configFile = fs.readFileSync(this.filePath);
			var config = JSON.parse(configFile);
			config.push(array);
			var configJSON = JSON.stringify(config);
			fs.writeFileSync(this.filePath, configJSON);
		}
		else
		{
			var array = [{'type': this.filename, 'data': this.dataToStore}];
			var configJSON = JSON.stringify(array);
			fs.writeFileSync(this.filePath, configJSON);
		}
		this.tmpForDifferenct = [];
		this.dataToStore = [];
	}
}

module.exports = saveMgr;