$("body").append( "<div id='placeholder'><div id='sgChart'></div><div id='animationdiv'><div id='animationGesture'></div></div></div>" );

$('#placeholder').css({ 
    position: "fixed",
    width : 400,
    height: 300,
    backgroundColor: "white",
    bottom: 0,
    right: 0,
    opacity: 0.8
})

$('#sgChart').css({ 
    width : 400,
    height: 300,
    bottom: 0,
    right: 0,
})

$('#animationdiv').css({ 
    position: "fixed",
    width : 400,
    height: 300,
    bottom: 0,
    right: 0,
})

var socket = io('http://localhost:3000');
socket.on('gesture', function (data) {
    changeAnimation(data.gestureID.gestureID);
    $("#sgChart").fadeIn("slow");
    $("#animationdiv").fadeOut("slow");
});


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
    $("#animationGesture").removeClass();
    $("#sgChart").fadeOut("slow");
    $("#animationdiv").fadeIn("slow");
    return;
  }



  if (index == 2 || index == 4 || index == 6 || index == 8 || index == 10)
  {
    $("#animationGesture").css("background-color", "red");  
  }
  else if(index == 11 || index == 12 || index == 13 || index == 14)
  {
    $("#animationGesture").css("background-color", "orange");   
  }
  else{
    $("#animationGesture").css("background-color", "green");   
  }
  
  $("#animationGesture").removeClass();
  $("#animationGesture").addClass(animationCSSName[animationType]);
}



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
    })
}, 100);