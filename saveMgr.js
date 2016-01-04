var app = require('./app.js');
var fs = require('fs');
var csv = require("fast-csv");

var saveMgr = {
	csvStream : null,
	filename : null,
	writableStream : null,
	SGsBase : null,
	init: function (folder, filename, needHeader)
	{
		this.filename = filename;
		this.writableStream = fs.createWriteStream("."+ folder + filename +".csv");
		this.csvStream = csv.createWriteStream({'headers': needHeader, 'flags': 'a'});
		this.csvStream.pipe(this.writableStream);
	},
	writeData: function (data) {
		needToStoreData = data.split(" ");
		this.csvStream.write({sg0: needToStoreData[1] - 512, sg2: needToStoreData[2] - 512, sg3: needToStoreData[3] - 512, sg4: needToStoreData[4] - 512, sg5: needToStoreData[5] - 512, sg6: needToStoreData[6] - 512, sg7: needToStoreData[7] - 512, sg8: needToStoreData[8] - 512, sg9: needToStoreData[9] - 512});
	},

	endOfWriting: function (){
		this.csvStream.end();
	}
}

module.exports = saveMgr;