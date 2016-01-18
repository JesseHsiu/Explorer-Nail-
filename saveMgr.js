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
	init: function (folder, filename, needHeader)
	{
		this.filePath = "."+ folder + "data.json";
		this.filename = filename;
		// this.writableStream = fs.createWriteStream(this.filePath);
		// this.csvStream = csv.createWriteStream({'headers': needHeader, 'flags': 'a'});
		// this.csvStream.pipe(this.writableStream);
	},
	writeData: function (data) {
		needToStoreData = data.split(" ");

		var datas = [];

		for (var i = 1; i < needToStoreData.length-1; i++) {
			datas.push(needToStoreData[i] - 512);
		};
		this.dataToStore.push(datas);
		// this.csvStream.write({sg0: needToStoreData[1] - 512, sg2: needToStoreData[2] - 512, sg3: needToStoreData[3] - 512, sg4: needToStoreData[4] - 512, sg5: needToStoreData[5] - 512, sg6: needToStoreData[6] - 512, sg7: needToStoreData[7] - 512, sg8: needToStoreData[8] - 512, sg9: needToStoreData[9] - 512});
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
	}
}

module.exports = saveMgr;