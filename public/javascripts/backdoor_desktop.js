var socket = io('http://127.0.0.1:3000');
socket.on('gesture', function (data) {
	console.log(data.gestureID.gestureID)
	changeAnimation(data.gestureID.gestureID);
});


var nameOfGestures=[
  '',
  'You just pefrom Tap',
  'You just pefrom Force Tap',
  'You just pefrom Swipe Left',
  'You just pefrom Force Swipe  Left',
  'You just pefrom Swipe Right',
  'You just pefrom Force Swipe Right',
  'You just pefrom Swipe Up',
  'You just pefrom Force Swipe Up',
  'You just pefrom Swipe Down',
  'You just pefrom Force Swipe Down',
  'Please perform gesture now.'
];

var animationCSSName = ["animation-tap","animation-rightLeft","animation-leftRight","animation-bottomUp","animation-upBottom","animation-stop"];

function changeAnimation (index) {
	if (index == 0) {return}
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
    $("#detectAnimation").css("background-color", "red");  
  }
  else if(index == 11 || index == 12 || index == 13 || index == 14)
  {
    $("#detectAnimation").css("background-color", "orange");   
  }
  else{
    $("#detectAnimation").css("background-color", "green");   
  }
  
  $("#detectAnimation").removeClass();
  $("#detectAnimation").addClass(animationCSSName[animationType]);
  $("#info").text(nameOfGestures[index]);
}


changeAnimation(11);

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
        obj = JSON.parse(data);
        var values = obj.values.split(",");

        chart.load({
        columns: [
         	['SG1', values[0]-512],
            ['SG2', values[1]-512],
            ['SG3', values[2]-512],
            ['SG4', values[3]-512],
            ['SG5', values[4]-512],
            ['SG6', values[5]-512],
            ['SG7', values[6]-512],
            ['SG8', values[7]-512],
            ['SG9', values[8]-512]
        ]
      });
      },
      error: function(jqXHR, textStatus, errorThrown) {
      }
  });
}, 100);