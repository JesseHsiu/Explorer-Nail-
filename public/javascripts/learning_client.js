var record_state = {
  IDLE: 0,
  RECORDING: 1,
};

var state = record_state.IDLE;
var currentType = 1;
var currentRound = 1;
// Config this.
var numOfGestures = 16;
var numOfRounds = 10;

$("#Type").text("Current Type: " + currentType.toString());
$("#Round").text("Current Rount: "+ currentRound.toString());
$("#doneNotification").hide();
function recordBtnClick () {
	console.log("BtnClick")
	if (state == record_state.IDLE)
	{
		$.ajax({
            url: 'http://127.0.0.1:3000/training/start/'+ currentType.toString(),
            cache: false,
            timeout: 5000
        });
        state = record_state.RECORDING;
		$("#recordBtn").addClass("btn-danger");
		$("#recordBtn").text(" End Record ");
	}
	else if ( state == record_state.RECORDING){
		$.get("/training/end", function(data, status){
			state = record_state.IDLE;
			$("#recordBtn").removeClass("btn-danger");
			$("#recordBtn").text("Start Record");

      if (currentType % numOfGestures == 0) {
        if (currentRound % numOfRounds == 0)
        {
          $("#doneNotification").show();
        };
        currentRound++;
        currentType = 1;
      }
      else{
        currentType++;
      }

      $("#Type").text("Current Type: " + currentType.toString());
      $("#Round").text("Current Rount: "+ currentRound.toString());
      

      });
      

      
	}
}
function cleanBtnClick () {
	$.ajax({
        url: 'http://127.0.0.1:3000/training/cleardata',
        cache: false,
        timeout: 5000
    });
    state = record_state.IDLE;
	$("#recordBtn").removeClass("btn-danger");
	$("#recordBtn").text("Start Record");
}


function trainByTheData () {
	$.ajax({
        url: 'http://127.0.0.1:3000/training/trainCurrentData',
        cache: false,
        timeout: 5000
    });
    state = record_state.IDLE;
}

// Charts Thing
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

// window.setInterval(function(){

//   $.ajax({
//       url: 'http://127.0.0.1:3000/SGValues',
//       dataType: "jsonp",
//       jsonpCallback: "_SGValues",
//       cache: false,
//       timeout: 5000,
//       success: function(data) {
//         // console.log(data)
//         obj = JSON.parse(data);
//         var values = obj.values.split(",");

//         // console.log((['SG1']).concat(SG_values[0]));
        
//         for (var i = 0; i < values.length; i++) {
//          SG_values[i].push(values[i]);
//          SG_values[i].shift();

//          SG_values[i].unshift('SG' + String(i+1));
//          SG_values[i].shift();

//         };

//         chart.load({
//         columns: [
//           ['SG1', SG_values[0][9]-512],
//             ['SG2', SG_values[1][9]-512],
//             ['SG3', SG_values[2][9]-512],
//             ['SG4', SG_values[3][9]-512],
//             ['SG5', SG_values[4][9]-512],
//             ['SG6', SG_values[5][9]-512],
//             ['SG7', SG_values[6][9]-512],
//             ['SG8', SG_values[7][9]-512],
//             ['SG9', SG_values[8][9]-512]
//         ]
//       });
//       },
//       error: function(jqXHR, textStatus, errorThrown) {
//       }
//   });
// }, 100);