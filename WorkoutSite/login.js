function checkPassword(){
	var xhttp = new XMLHttpRequest();
	var user = document.getElementById("inputuser").value;
	var pw = document.getElementById("inputpassword").value;
	
	if (pw == '' || user == '') return;
	
	document.getElementById("inputuser").value = '';
	document.getElementById("inputpassword").value = '';
  	
  	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		if (this.responseText == "true"){
				location.href = '/home.html';
    		} else if (this.responseText == "false"){
    			document.getElementById("response").color = "red";
				document.getElementById("response").innerHTML = "Invalid Login";
    		}
    	}
  	};
  	
  	xhttp.open("POST", "CheckPassword" , true);
  	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  	xhttp.send("User=" + user + "&Password=" + pw);
}
