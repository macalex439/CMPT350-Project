$(document).ready(function(){
	$('#date').datepicker({dateFormat: "yy/mm/dd", minDate:"-30d", maxDate:"0d" });
	
	$.fn.logWorkout = function(){
		$.post("/LogWorkout",
		{
		 date: $('#date').val(),
		 bweight: $('#bweight').val(),
		 bsets: $('#bsets').val(),
		 breps: $('#breps').val(),
		 sweight: $('#dweight').val(),
		 ssets: $('#dsets').val(),
		 sreps: $('#dreps').val(),
		 dweight: $('#sweight').val(),
		 dsets: $('#ssets').val(),
		 dreps: $('#sreps').val()
		},
		function(data){
			alert(data);
		});	
		 $('#date').val('');
		 $('#bweight').val('');
		 $('#bsets').val('');
		 $('#breps').val('');
		 $('#dweight').val('');
		 $('#dsets').val('');
		 $('#dreps').val('');
		 $('#sweight').val('');
		 $('#ssets').val('');
		 $('#sreps').val('');	 		 
	}
});

function doSome(){
	alert("fuck");
}

function logWorkout(){
	var date = document.getElementById('date').value;
	var bweight = document.getElementById('bweight').value;
	var bsets = document.getElementById('bsets').value;
	var breps = document.getElementById('breps').value;
	var sweight = document.getElementById('sweight').value;
	var ssets = document.getElementById('ssets').value;
	var sreps = document.getElementById('sreps').value;
	var dweight = document.getElementById('dweight').value;
	var dsets = document.getElementById('dsets').value;
	var dreps = document.getElementById('dreps').value;	
	
	document.getElementById('date').value = '';
	document.getElementById('bweight').value = '';
	document.getElementById('bsets').value = '';
	document.getElementById('breps').value = '';
	document.getElementById('sweight').value = '';
	document.getElementById('ssets').value = '';
	document.getElementById('sreps').value = '';
	document.getElementById('dweight').value = '';
	document.getElementById('dsets').value = '';
	document.getElementById('dreps').value = '';		
	
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
     		alert(this.responseText);
    	}
  	};
  	
  	xhttp.open("POST", "LogWorkout", true);
  	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  	xhttp.send("date="+date+ "&bweight="+bweight+"&bsets="+bsets+"&breps="+breps+"&sweight="+sweight+"&ssets="+ssets+"&sreps="+seps+"&dweight="+dweight+"&dsets="+dsets+"&dreps="+dreps);  

}