var SG_values = [[],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 []];

var stateMachine = {
  IDLE: 0,
  START: 1,
  END: 2,
};

var state = stateMachine.END;

var socket = io('http://localhost:3000');
// socket.on('identification', function (data) {
//   console.log(data);
//   socket.emit('identification', { device: 'desktop' });
// });

// var state = 'Idle';
var collect_datalength = 50;
// var activate_datalength = 30;


var recount = 0;
var idleCount = 9;
var stdText = "";
// socket.on('SGdata', function (data) {
//   // console.log(state);
//   var sgValues = data['data'];
//   $('#value').text(sgValues);
//   stdText = "";
//   // var startDetect = false;
//   // var endDetect = false;
//   idleCount = 0;
//   for (var i = 0; i < sgValues.length; i++) {
//     SG_values[i].push(sgValues[i]);
//     var stdValue = standardDeviation(SG_values[i]);
//     stdText += Math.floor(stdValue).toString() + ",";
//     if (SG_values[i].length > collect_datalength) {
//       SG_values[i].shift();
//       if (state == stateMachine.START)
//       {
        
//         // console.log(i);
//         // console.log(stdValue);
//         if (stdValue < 100)
//         {
//           idleCount += 1;
//         }
//       }
//       else{
//         idleCount += 1;
//       }
//     };
//   };
  
//   // console.log(idleCount);
//   // console.log(state);
//   if (idleCount == 9 && SG_values[0].length == collect_datalength)
//   {
//     state = stateMachine.END;
//   }
//   else{
//     console.log(new Date() - endtime);
//   }
//   // else{
//   //   state = stateMachine.START;
//   // }
//   // console.log(state);

//   // if (startDetect) {state = stateMachine.START;}
//   // else if(endDetect){state = stateMachine.IDLE;};

//   $('#stdText').text(stdText);
//   if (state == stateMachine.IDLE) {
//     $('#state').text('Current State: Idle');
//   }
//   else if(state == stateMachine.START)
//   {
//     $('#state').text('Current State: Start');
//   }
//   else if(state == stateMachine.END)
//   {
//     $('#state').text('Current State: End');
//   }

// });

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
      endCollet();
    }
}

function getAvg (array) {
  var total = 0;
  for(var j = 0; j < array.length; j++) {
      total += array[j];
  }
  return total / array.length;
}

function predictNow () {
  $.ajax({
        url: 'http://127.0.0.1:3000/detectgesture/predict',
        cache: false,
        timeout: 5000
  });
}

function startCollect()
{
  console.log("set Start")
  state = stateMachine.START;
  SG_values = [[],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 []];
}


var endtime = new Date();
function endCollet()
{
  endtime = new Date();
}


function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}
