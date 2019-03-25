function register(){
	var xhttp = new XMLHttpRequest();
	var user = document.getElementById("createuser").value;
	var pw = document.getElementById("createpassword").value;
	var cpw = document.getElementById("confirmpassword").value;
	
	if (pw == '' || user == '' || cpw == '') return;
	
	if (pw != cpw) {
		document.getElementById("response").color = "red";
		document.getElementById("response").innerHTML = "Passwords Do Not Match";
		document.getElementById("createpassword").value = '';
		document.getElementById("confirmpassword").value = '';
		return;
	}
	
	document.getElementById("createuser").value = '';
	document.getElementById("createpassword").value = '';
	document.getElementById("confirmpassword").value = '';

	if (user.indexOf(' ') > 0){
    	document.getElementById("response").color = "red";
		document.getElementById("response").innerHTML = "Invalid Username";
		return;
	}	
	
  	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		if (this.responseText == "true"){
    		    document.getElementById("response").color = "green";
				document.getElementById("response").innerHTML = "User Successfully Created";
    		}
    		else if (this.responseText == "false"){
    			document.getElementById("response").color = "red";
				document.getElementById("response").innerHTML = "That Username Is Already In Use";
    		}
    	}
  	};
  	
  	xhttp.open("POST", "Register" , true);
  	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  	xhttp.send("User=" + user + "&Password=" + pw);
}
