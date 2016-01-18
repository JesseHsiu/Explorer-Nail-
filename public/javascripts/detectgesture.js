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

var state = stateMachine.IDLE;

var socket = io('http://localhost:3000');
socket.on('identification', function (data) {
  console.log(data);
  socket.emit('identification', { device: 'desktop' });
});

// var state = 'Idle';
var collect_datalength = 60;
var activate_datalength = 30;


var recount = 0;
socket.on('SGdata', function (data) {
  console.log('data');
  var sgValues = data['data'];
  $('#value').text(sgValues);

  var startDetect = false;
  var endDetect = false;
  for (var i = 0; i < sgValues.length; i++) {
    SG_values[i].push(sgValues[i]);
    if (SG_values[i].length > collect_datalength) {
      SG_values[i].shift();

      if (state == stateMachine.IDLE)
      {
        var act_front = SG_values[i].slice(0, activate_datalength/2) 
        var act_end = SG_values[i].slice(activate_datalength/2, activate_datalength) 
        
        var act_frontavg = getAvg(act_front);
        var act_endavg = getAvg(act_end);

        if (act_endavg/act_frontavg > 1.2 || act_endavg/act_frontavg < 0.8) {
          startDetect = true;
          for (var i = 0; i < SG_values.length; i++) {
            SG_values[i] = [];
          };
        }
      }
      else if(state == stateMachine.START){
        var front = SG_values[i].slice(0, collect_datalength/2) 
        var end = SG_values[i].slice(collect_datalength/2, collect_datalength) 
        
        var frontavg = getAvg(front);
        var endavg = getAvg(end);

        if (endavg/frontavg < 1.05 && endavg/frontavg > 0.95) {endDetect = true;}
        
      }
    };
  };

  if (startDetect) {state = stateMachine.START;}
  else if(endDetect){state = stateMachine.IDLE;};


  if (state == stateMachine.IDLE) {
    $('#state').text('Current State: Idle');
  }
  else if(state == stateMachine.START)
  {
    $('#state').text('Current State: Start');
  }
  else if(state == stateMachine.END)
  {
    $('#state').text('Current State: End');
  }

});

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

