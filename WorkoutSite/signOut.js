function signOut(){
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		if (this.responseText == "true"){
				location.href = '/login.html';
    		} 
    	}
  	};
  	
  	xhttp.open("GET", "SignOut" , true);
  	xhttp.send();
}