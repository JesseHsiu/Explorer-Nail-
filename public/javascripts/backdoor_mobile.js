// 172.20.10.12
var socket = io('http://192.168.31.163:3000');
socket.on('gesture', function (data) {
	console.log(data)
});
function tapClick(id)
{
	socket.emit('gesture', { gestureID: id});
}
$('#myElement').css('background-color', 'green');
function modeswitch() {
	if (currentMode == 0)
	{
		$('#myElement').css('background-color', 'red');
		currentMode = 1;
	}
	else{
		currentMode = 0;
		$('#myElement').css('background-color', 'green');
	}
}

var myElement = document.getElementById('myElement');

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

// mc.get('pinch').set({ enable: true });
// mc.get('rotate').set({ enable: true });
// mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });



mc.get('tap').set({ enable: true });


// 0 - normal
// 1 - force
var currentMode = 0;


// listen to events...
mc.on("tap", function(ev) {
	if (currentMode == 0)
	{
		tapClick(1);
	}
	else{
		tapClick(2);	
	}
    
});

mc.on("swipeleft", function(ev) {
	if (currentMode == 0)
	{
		tapClick(3);
	}
	else{
		tapClick(4);	
	}
    
});

mc.on("swiperight", function(ev) {
	if (currentMode == 0)
	{
		tapClick(5);
	}
	else
	{
		tapClick(6);
	}
});

mc.on("swipeup", function(ev) {
    if (currentMode == 0)
	{
		tapClick(7);
	}
	else
	{
		tapClick(8);
	}
});

mc.on("swipedown", function(ev) {
    if (currentMode == 0)
	{
		tapClick(9);
	}
	else
	{
		tapClick(10);
	}
});


