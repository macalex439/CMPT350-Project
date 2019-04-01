$(document).ready(function(){

	$.fn.loadScrollMenu = function(){
		
		var scrollDates = "";
		var year = new Date().getFullYear();
		var month = new Date().getMonth();
		var day = new Date().getDate();
		
		var startDay, endDay, startMonth, endMonth;
		
		var daysInPrevMonth = 32 - (new Date(year, month-1,32)).getDate();
		var daysInMonth = 32-(new Date(year,month,32)).getDate();
		var daysInNextMonth = 32-(new Date(year,month+1,32)).getDate();
		
		
		if ((day - 30) <1){
		 startDay = daysInPrevMonth + (day - 30);
		 startMonth = month-1;
		}
		else {
		 startDay = (day-30);
		 startMonth = month;
		}
		

		if ((day + 12)>daysInMonth){
		 endDay = (day + 12 - daysInMonth);
		 endMonth = month + 1;
		}
		else{
		  endDay = (day + 12);
		  endMonth = month;
		} 
		
		for (var i = startMonth; i<= endMonth; i ++){
			if (i == (month -1)){
				for (var j=startDay; j<= daysInPrevMonth; j++){
					scrollDates +="<a href='#' onclick='parent.location=\"/viewworkouts.html?datelog="+year.toString()+"/"+(i+1).toString()+"/"+j.toString()+"\"; return false;'>"+months[i]+"<br></br>"+j+"</a>";
				}
			} else if (i == month){
				for (var j=1; j<= daysInMonth; j++){
					if (i == month && j == day){
					scrollDates +="<a href='#' onclick='parent.location=\"/viewworkouts.html?datelog="+year.toString()+"/"+(i+1).toString()+"/"+j.toString()+"\";return false;'>"+months[i]+"<br></br><font style='text-decoration:underline;'>"+j+"</font></a>";
					} else if (j>day){
					scrollDates +="<a href='#'><font style='color:grey'>"+ months[i] +"<br></br>"+j+"</font></a>";
					} else {
					scrollDates +="<a href='#' onclick='parent.location=\"/viewworkouts.html?datelog="+year.toString()+"/"+(i+1).toString()+"/"+j.toString()+"\"; return false;'>"+months[i]+"<br></br>"+j+"</a>";
					}
					if (i == endMonth && j == endDay){
						break;
					}
				}
			} else if (i == (month + 1)){
				for (var j=1; j<= endDay; j++){
					scrollDates +="<a href='#'><font style='color:grey'>"+ months[i] +"<br></br>"+j+"</font></a>";
				}
			}
		}
		
		
		function getWidth() {
  			return Math.max(
    			document.body.scrollWidth,
    			document.documentElement.scrollWidth,
    			document.body.offsetWidth,
    			document.documentElement.offsetWidth,
    			document.documentElement.clientWidth,
    			1800
  			);
		}
		$('#scrolldate').html(scrollDates);
		$('#scrolldate').scrollLeft(0.65*getWidth());
	}
});

// "<a href='/viewworkouts.html' onclick='parent.location=\"/viewworkouts.html\"; return false;'>"

var months = new Array();
months[0] = "Jan";
months[1] = "Feb";
months[2] = "Mar";
months[3] = "Apr";
months[4] = "May";
months[5] = "Jun";
months[6] = "Jul";
months[7] = "Aug";
months[8] = "Sep";
months[9] = "Oct";
months[10] = "Nov";
months[11] = "Dec"; 
