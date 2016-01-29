var record_state = {
  IDLE: 0,
  RECORDING: 1,
};

var state = record_state.IDLE;
var currentType = 1;
var currentRound = 1;
// Config this.
var numOfGestures = 14;
var numOfRounds = 10;

var animationCSSName = ["animation-tap","animation-rightLeft","animation-leftRight","animation-bottomUp","animation-upBottom","animation-shearLeft", "animation-shearRight", "animation-shearUp", "animation-shearDown"];

var nameOfGestures=[
  '',
  'Tap',
  'Force Tap',
  'Swipe Left',
  'Swipe Force Left',
  'Swipe Right',
  'Swipe Force Right',
  'Swipe Up',
  'Swipe Force Up',
  'Swipe Down',
  'Swipe Force Down',
  'Shear Left',
  'Shear Right',
  'Shear Up',
  'Shear Down'
];


function changeAnimation (index) {
  var animationType;
  var force = false;

  //tap
  if (index == 1 || index == 2)
  {
    animationType = 0;
  }
  //left
  else if(index == 3 || index == 4){
    animationType = 1;
  }
  //right
  else if(index == 5 || index == 6){
    animationType = 2;
  }
  //up
  else if(index == 7 || index == 8){
    animationType = 3;
  }
  //down
  else if(index == 9 || index == 10){
    animationType = 4;
  }
  else if(index == 11)
  {
    animationType = 5;
  }
  else if(index == 12)
  {
    animationType = 6; 
  }
  else if(index == 13)
  {
    animationType = 7;
  }
  else if(index == 14)
  {
    animationType = 8;
  }



  if (index == 2 || index == 4 || index == 6 || index == 8 || index == 10)
  {
    $("#instructionAnimation").css("background-color", "red");  
  }
  else if(index == 11 || index == 12 || index == 13 || index == 14)
  {
    $("#instructionAnimation").css("background-color", "orange");   
  }
  else{
    $("#instructionAnimation").css("background-color", "green");   
  }
  
  $("#instructionAnimation").removeClass();
  $("#instructionAnimation").addClass(animationCSSName[animationType]);
}




window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '32') {
      recordBtnClick();
    }
}
// var task = [];


var task = new Array(numOfRounds);
for (var i = 0; i < numOfRounds; i++) {
  task[i] = [];
  
  for (var j = 1; j <= numOfGestures; j++) {
    task[i].push(j);
  };
  task[i] = shuffle(task[i]);
}

// for (var i = 1; i <= numOfGestures; i++) {
//   task.push(i);
// };
// task = shuffle(task);

updateText();

changeAnimation(task[currentRound-1][currentType-1]);


$("#doneNotification").hide();
function recordBtnClick () {

	console.log("BtnClick")
	if (state == record_state.IDLE)
	{
		$.ajax({
            url: 'http://127.0.0.1:3000/training/start/'+ task[currentRound-1][currentType-1].toString(),
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
      console.log(currentType);
      updateText();
      changeAnimation(task[currentRound-1][currentType-1]);
      

      });
      

      
	}
}

function updateText()
{
  changeAnimation(task[currentRound-1][currentType-1]);
  $("#nameOfGesture").text('Task: ' + nameOfGestures[task[currentRound-1][currentType-1]]);
  $("#Type").text("Current Type: " + task[currentRound-1][currentType-1].toString());
  $("#Round").text("Current Rount: "+ currentRound.toString());
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

function deleteLastOne(){
  $.ajax({
    url: 'http://127.0.0.1:3000/training/deleteLastOne',
    cache: false,
    timeout: 5000
  });
  state = record_state.IDLE;
  if (currentType == 1)
  {
    currentType = numOfGestures;
    currentRound --;
  }
  else{
    currentType --;
  }

  updateText();
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


function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}