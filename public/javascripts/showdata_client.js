$.ajax({
      url: 'http://127.0.0.1:3000/showdata/datalist',
      dataType: "jsonp",
      jsonpCallback: "_datalist",
      cache: false,
      timeout: 1000,
      success: function(data) {
        needToShowData = data.split(",");

        $('#datalist').append($("<option></option>").attr("value", " ").text(" "));

        for (var i = 0; i < needToShowData.length; i++) {
          $('#datalist')
             .append($("<option></option>")
             .attr("value",needToShowData[i])
             .text(needToShowData[i])); 
        };
      },
      error: function(jqXHR, textStatus, errorThrown) {
      }
  });


$('#datalist').change(function() {
  // console.log($( this ).val());
  c3.generate({
    bindto: '#chart',
    data: {
        url: '/data/'+$( this ).val(),
        type: 'line'
    },
    bar: {
        width: {
            ratio: 0.8
        }
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
    zoom: {
      enabled: true
    }
  });
});