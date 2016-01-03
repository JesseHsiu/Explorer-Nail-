var SG_values = [[],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 []];



var socket = io('http://localhost:3000');
socket.on('identification', function (data) {
  console.log(data);
  socket.emit('identification', { device: 'desktop' });
});

var state = 'Idle';
var datalength = 50;

socket.on('SGdata', function (data) {
  console.log('data');
  var sgValues = data['data'];
  $('#value').text(sgValues);

  var showDetect = false;
  for (var i = 0; i < sgValues.length; i++) {
    SG_values[i].push(sgValues[i]);
    if (SG_values[i].length > datalength) {
      SG_values[i].shift();



      var front = SG_values[i].slice(0, datalength/2) 
      var end = SG_values[i].slice(datalength/2, datalength) 
      
      var frontavg = getAvg(front);
      var endavg = getAvg(end);

      // console.log(i);
      // console.log(frontavg);
      // console.log();

      if (endavg/frontavg > 1.2 || endavg/frontavg < 0.8) {showDetect = true;}
      // else if (endavg/frontavg < 1.1 && endavg/frontavg > 0.9) {};

    };

  };

  if (showDetect) {
    state = 'Start Gesture'; $('#state').text('Current State: ' + state);
  }
  else{
    state = 'Idle'; $('#state').text('Current State: ' + state);
  };

});

function getAvg (array) {
  var total = 0;
  for(var j = 0; j < array.length; j++) {
      total += array[j];
  }
  return total / array.length;
}

