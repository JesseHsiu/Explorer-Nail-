var record_state = {
  IDLE: 0,
  RECORDING: 1,
};

var state = record_state.IDLE;

function recordBtnClick () {
	console.log("BtnClick")
	if (state == record_state.IDLE)
	{
		$.ajax({
            url: 'http://127.0.0.1:3000/records/start/'+ $("#filename").val(),
            cache: false,
            timeout: 5000
        });
        state = record_state.RECORDING;
		$("#recordBtn").addClass("btn-danger");
		$("#recordBtn").text(" End Record ");
	}
	else if ( state == record_state.RECORDING){
		$.get("/records/end", function(data, status){
			state = record_state.IDLE;
			$("#recordBtn").removeClass("btn-danger");
			$("#recordBtn").text("Start Record");
	    });
	}
}

function reopenPort () {
	$.ajax({
        url: 'http://127.0.0.1:3000/reopenPort',
        cache: false,
        timeout: 1000
    });
}