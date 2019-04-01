$(document).ready(function(){
	
	loadViewWorkouts(datelog);
	
	$.fn.deleteWorkoutLog = function(){
		var tempdate = $('#response').html();
		$.delete("/DeleteWorkoutLog",
		 {
		  datelog: tempdate
    	 },
		 function (data, status){
			alert(data);
		});
		
		loadViewWorkouts(tempdate);
	}

});

function getParameterByName(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var datelog = getParameterByName('datelog');
	
function loadViewWorkouts(date){
	document.getElementById('response').innerHTML = date;
	
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
     		document.getElementById("tablebody").innerHTML = this.responseText;
    	}
  	};
  	
  	xhttp.open("GET", "/ViewWorkouts?datelog="+date , true);
  	xhttp.send();
}

jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});