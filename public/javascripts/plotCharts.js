
var SG_values = [[0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0]];


var chart = c3.generate({
    bindto: '#chart',
    data: {
        columns: [
            ['SG1', 0],
            ['SG2', 0],
            ['SG3', 0],
            ['SG4', 0],
            ['SG5', 0],
            ['SG6', 0],
            ['SG7', 0],
            ['SG8', 0],
            ['SG9', 0]
        ],
        type: 'bar'
    },
    bar: {
        width: {
            ratio: 0.8
        }
    },
    interaction: {
	  enabled: false
	},
	axis: {
	  y: {
	  	min: -512,
	  	max: 512
	  }
	},
	grid: {
        y: {
            lines: [{value:0}]
        }
    }
});


var sg1chart = c3.generate({
    bindto: '#sg1',
    data: {
        columns: [
            ['SG1']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var sg2chart = c3.generate({
    bindto: '#sg2',
    data: {
        columns: [
            ['SG2']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var sg3chart = c3.generate({
    bindto: '#sg3',
    data: {
        columns: [
            ['SG3']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var sg4chart = c3.generate({
    bindto: '#sg4',
    data: {
        columns: [
            ['SG4']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var sg5chart = c3.generate({
    bindto: '#sg5',
    data: {
        columns: [
            ['SG5']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var sg6chart = c3.generate({
    bindto: '#sg6',
    data: {
        columns: [
            ['SG6']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var sg7chart = c3.generate({
    bindto: '#sg7',
    data: {
        columns: [
            ['SG7']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var sg8chart = c3.generate({
    bindto: '#sg8',
    data: {
        columns: [
            ['SG8']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var sg9chart = c3.generate({
    bindto: '#sg9',
    data: {
        columns: [
            ['SG9']
        ],
        type: 'spline'
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      }
    },
    size: {
	  width: 250,
	  height: 250
	}
});
var chartsOfSG = [sg1chart,sg2chart,sg3chart,sg4chart,sg5chart,sg6chart,sg7chart,sg8chart,sg9chart];



window.setInterval(function(){

  $.ajax({
      url: 'http://127.0.0.1:3000/SGValues',
      dataType: "jsonp",
      jsonpCallback: "_SGValues",
      cache: false,
      timeout: 5000,
      success: function(data) {
        // console.log(data)
        obj = JSON.parse(data);
        var values = obj.values.split(",");

        console.log((['SG1']).concat(SG_values[0]));
        
        for (var i = 0; i < values.length; i++) {
        	SG_values[i].push(values[0]);
        	SG_values[i].shift();

        	SG_values[i].unshift('SG' + String(i+1));
        	chartsOfSG[i].load({
				columns:[
					SG_values[i]
				]
        	});
        	SG_values[i].shift();

        };

        chart.load({
		  columns: [
		    ['SG1', SG_values[0][9]-500],
            ['SG2', SG_values[1][9]-500],
            ['SG3', SG_values[2][9]-500],
            ['SG4', SG_values[3][9]-500],
            ['SG5', SG_values[4][9]-500],
            ['SG6', SG_values[5][9]-500],
            ['SG7', SG_values[6][9]-500],
            ['SG8', SG_values[7][9]-500],
            ['SG9', SG_values[8][9]-500]
		  ]
		});
      },
      error: function(jqXHR, textStatus, errorThrown) {
      }
  });
}, 100);