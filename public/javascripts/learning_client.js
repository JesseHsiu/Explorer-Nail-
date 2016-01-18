var record_state = {
  IDLE: 0,
  RECORDING: 1,
};

var state = record_state.IDLE;
var selectElement = ""

$("input:radio[name=type]").click(function() {
    selectElement = $(this).val();
});

function recordBtnClick () {
	console.log("BtnClick")
	if (state == record_state.IDLE)
	{
		$.ajax({
            url: 'http://127.0.0.1:3000/learning/start/'+ selectElement,
            cache: false,
            timeout: 5000
        });
        state = record_state.RECORDING;
		$("#recordBtn").addClass("btn-danger");
		$("#recordBtn").text(" End Record ");
	}
	else if ( state == record_state.RECORDING){
		$.get("/learning/end", function(data, status){
			state = record_state.IDLE;
			$("#recordBtn").removeClass("btn-danger");
			$("#recordBtn").text("Start Record");
	    });
	}
}
function cleanBtnClick () {
	$.ajax({
        url: 'http://127.0.0.1:3000/learning/cleardata',
        cache: false,
        timeout: 5000
    });
    state = record_state.IDLE;
	$("#recordBtn").removeClass("btn-danger");
	$("#recordBtn").text("Start Record");
}


function trainByTheData () {
	$.ajax({
        url: 'http://127.0.0.1:3000/learning/trainCurrentData',
        cache: false,
        timeout: 5000
    });
    state = record_state.IDLE;
}
