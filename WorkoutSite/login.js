// var http = require("http");

function checkPassword(){
	var xhttp = new XMLHttpRequest();
	var user = document.getElementById("inputuser").value;
	var pw = document.getElementById("inputpassword").value;
	
	if (pw == '' || user == '') return;
	
	document.getElementById("inputuser").value = '';
	document.getElementById("inputpassword").value = '';
	
//  	document.getElementById("response").innerHTML = "Invalid User";
  	
  	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		if (this.responseText == "true"){
				location.reload();
    		} else{
				document.getElementById("response").innerHTML = "Invalid User";
    		}
    	}
  	};
  	
  	xhttp.open("POST", "CheckPassword" , true);
  	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  	xhttp.send("User=" + user + "&Password=" + pw);
}
