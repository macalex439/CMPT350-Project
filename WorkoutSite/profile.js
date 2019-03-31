$(document).ready(function(){
	$(".edit-profile").click(function(){
		$('#firstname').prop('readonly', false);
		$('#lastname').prop('readonly', false);
		$('#weight').prop('readonly', false);
		$('#height').prop('readonly',false);
		$('#birthday').datepicker("enable");
		$('#birthday').datepicker({dateFormat: "yy/mm/dd", changeYear:true, maxDate:"-15y" });
		$('#save').button('enable');
		$('#edit').button('disable');
		
	});
	
	$.fn.updateProfile = function(){
		$.put("/UpdateProfile",
		{
		 fname: $('#firstname').val(),
		 lname: $('#lastname').val(),
		 weight: $('#weight').val(),
		 height: $('#height').val(),
		 birthday: $('#birthday').val()
		},
		function (data,status){});
	}

	$(".save-profile").click(function(){
		
		$('#firstname').prop('readonly', true);
		$('#lastname').prop('readonly', true);
		$('#weight').prop('readonly', true);
		$('#height').prop('readonly',true);
		$('#birthday').datepicker("disable" );
		$('#save').button('disable');
		$('#edit').button('enable');	
		$.fn.updateProfile();
	});
	
	$.fn.changePassword = function(){
		$.put("/ChangePassword",
		{
		 pw: $('#pw').val(),
		 newpw: $('#newpw').val(),
		 confirmpw: $('#confirmpw').val()
		},
		function(data,status){
			$('#pw').val('');
			$('#newpw').val('');
			$('#confirmpw').val('');
			alert(data);
		});
	}
	
	$(".change-pw").click(function(){
		$.fn.changePassword();
	});
	
	$.fn.loadProfile = function(){
		$.get("/LoadProfile", 
		function(data, status){
			$('#firstname').val(JSON.parse(data)[0].fname);
			$('#lastname').val(JSON.parse(data)[0].lname);
			$('#birthday').val((JSON.parse(data)[0].birthday).substr(0,10));
			$('#weight').val(JSON.parse(data)[0].weight);
			$('#height').val(JSON.parse(data)[0].height);
		});
	}
	
});


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
