
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
        type: 'bar',
        labels: true
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
    },
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});


var sg1chart = c3.generate({
    bindto: '#sg1',
    data: {
        columns: [
            ['SG1']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});
var sg2chart = c3.generate({
    bindto: '#sg2',
    data: {
        columns: [
            ['SG2']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});
var sg3chart = c3.generate({
    bindto: '#sg3',
    data: {
        columns: [
            ['SG3']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});
var sg4chart = c3.generate({
    bindto: '#sg4',
    data: {
        columns: [
            ['SG4']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});
var sg5chart = c3.generate({
    bindto: '#sg5',
    data: {
        columns: [
            ['SG5']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});
var sg6chart = c3.generate({
    bindto: '#sg6',
    data: {
        columns: [
            ['SG6']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});
var sg7chart = c3.generate({
    bindto: '#sg7',
    data: {
        columns: [
            ['SG7']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});
var sg8chart = c3.generate({
    bindto: '#sg8',
    data: {
        columns: [
            ['SG8']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
    }
});
var sg9chart = c3.generate({
    bindto: '#sg9',
    data: {
        columns: [
            ['SG9']
        ],
        type: 'spline',
        labels: true
    },
    axis: {
      y: {
        min: 0,
        max: 1024
      },
      x: {
	    show: false
	  }
    },
    size: {
	  width: 300,
	  height: 200
	},
	interaction: {
	  enabled: false
	},
    transition: {
	  duration: 0
	},
    tooltip: {
      show: false
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

        // console.log((['SG1']).concat(SG_values[0]));
        
        for (var i = 0; i < values.length; i++) {
        	SG_values[i].push(values[i]);
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
		    ['SG1', SG_values[0][9]-512],
            ['SG2', SG_values[1][9]-512],
            ['SG3', SG_values[2][9]-512],
            ['SG4', SG_values[3][9]-512],
            ['SG5', SG_values[4][9]-512],
            ['SG6', SG_values[5][9]-512],
            ['SG7', SG_values[6][9]-512],
            ['SG8', SG_values[7][9]-512],
            ['SG9', SG_values[8][9]-512]
		  ]
		});
      },
      error: function(jqXHR, textStatus, errorThrown) {
      }
  });
}, 100);