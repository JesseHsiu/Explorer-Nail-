$("body").append( "<div id='placeholder'><div id='sgChart'></div><div id='animation'></div></div>" );

$('#placeholder').css({ 
    position: "fixed",
    width : 400,
    height: 300,
    backgroundColor: "white",
    bottom: 0,
    right: 0,
    opacity: 0.7
})

$('#sgChart').css({ 
    width : 400,
    height: 300,
})

var chart = c3.generate({
	bindto: '#sgChart',
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
            ratio: 0.9
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



window.setInterval(function(){
	$.ajax({
      url: 'http://127.0.0.1:3000/SGValues',
      // dataType: "jsonp",
      // jsonpCallback: "_SGValues",
      cache: false,
      timeout: 5000,
      success: function(data) {

      	obj = JSON.parse(data.slice(11,data.length-2));
        var values = obj.values.split(",");
        // console.log(values);
        
        chart.load({
		  columns: [
		    ['SG1', values[0]],
            ['SG2', values[1]],
            ['SG3', values[2]],
            ['SG4', values[3]],
            ['SG5', values[4]],
            ['SG6', values[5]],
            ['SG7', values[6]],
            ['SG8', values[7]],
            ['SG9', values[8]]
		  ]
		});
      },
      error: function(jqXHR, textStatus, errorThrown) {

      }
    })
}, 100);