var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var bodyparser = require("body-parser");
var DataBase = require('./DataBase.js');
var user;

var lock = true;
var app = express();
var db = new DataBase('localhost', 'root', '12345678','Workout');

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

/************SERVER**********************/
app.set('port', 80);

http.createServer(function(req,res){
	app(req,res);
}).listen(app.get('port'),
	function(){
		console.log("Express server listening on port: " + app.get('port'));
});	

/**************ROUTERS*******************/

///////Password and New Account Handlers ///////

app.post('/CheckPassword', function(req,res){
	db.checkUserAuth(req.body.User, function(results){
		if (results == req.body.Password){
			lock = false;
			user = req.body.User;
			res.write("true");
		}else {
			res.write("false");
		}
		return res.end();	
	});
});

app.post('/Register', function(req,res){
	db.createUser(req.body.User, req.body.Password, function(results){
		if (results == 'true'){
			db.createProfile(req.body.User);
			db.createWorkoutLog(req.body.User);
		}
		res.write(results);
		return res.end();
	});
});

app.put('/ChangePassword', function(req,res){
	if (req.body.newpw == '' || req.body.pw == '' || req.body.confirmpw == ''){
		res.write("You Cannot Leave Password Blank Fields");
		return res.end();
	} else if (req.body.newpw != req.body.confirmpw){
		res.write("New Passwords Do Not Match.");
		return res.end();
	} else{
	db.checkUserAuth(user, function(results){
		if (results == req.body.pw){
			db.changeUserPassword(user, req.body.newpw);
			res.write("Successfully Changed Password.");
		} else {
			res.write("Incorrect Password. Try Again.");
		}
		return res.end();
	});
	}
});

app.get('/SignOut', function(req,res){
	lock = true;
	res.write("true");
	return res.end();
});

//// Profile Handlers ///////////////

app.put('/UpdateProfile', function(req,res){

	var fname,lname,birthday,weight,height;
	
	if (req.body.fname == '') fname = '';
	else fname = req.body.fname;

	if (req.body.lname == '') lname = '';
	else lname = req.body.lname;
	
	if (req.body.birthday == '') birthday = 'NULL';
	else birthday = req.body.birthday;
	
	if (req.body.weight == '') weight = 'NULL';
	else weight = req.body.weight;
	
	if (req.body.height == '') height = 'NULL';
	else height = req.body.height;
		
	db.updateProfile(user,fname,lname,birthday,weight,height); 
	return res.end();
});

app.get('/LoadProfile', function(req,res){
	db.loadProfile(user, function(results){
		if (results) res.write(JSON.stringify(results));
		else res.write("what");
		return res.end();
	});
});

////////////Workout Log ////////////////////
app.get('/ViewWorkouts', function(req,res){
	var datelog = (url.parse(req.url,true)).query.datelog
	var workoutlog = '';	
	db.selectWorkoutLog(user,datelog,function(results){
		if (!results.length){
			workoutlog += '<tr><th> No Workouts Logged </th></tr>';
		} else {
			for (var i = 0; i < results.length; i ++){
				workoutlog+='<tr><th> Workout '+(i+1).toString()+' </th>';
				workoutlog+='<td>'+parseInt(results[i].bweight,10)+'</td>';
				workoutlog+='<td>'+parseInt(results[i].bsets,10)+'</td>';
				workoutlog+='<td>'+parseInt(results[i].breps,10)+'</td>';
				workoutlog+='<td>'+parseInt(results[i].dweight,10)+'</td>';
				workoutlog+='<td>'+parseInt(results[i].dsets,10)+'</td>';
				workoutlog+='<td>'+parseInt(results[i].dreps,10)+'</td>';
				workoutlog+='<td>'+parseInt(results[i].sweight,10)+'</td>';
				workoutlog+='<td>'+parseInt(results[i].ssets,10)+'</td>';
				workoutlog+='<td>'+parseInt(results[i].sreps,10)+'</td>';
				workoutlog+='<td>'+(parseInt(results[i].bweight,10)+parseInt(results[i].sweight,10)+parseInt(results[i].dweight,10))+'</td></tr>';
			}
		}
		res.write(workoutlog);
		return res.end();
	});
});

app.post('/LogWorkout', function(req,res){
	var date,bweight,bsets,breps,dweight,dsets,dreps,sweight,ssets,sreps;
	date = req.body.date;
	
	if (req.body.bweight == '') bweight = 'NULL';
	else bweight = req.body.bweight;
	
	if (req.body.bsets == '') bsets = 'NULL';
	else bsets = req.body.bsets;
	
	if (req.body.breps == '') breps = 'NULL';
	else breps = req.body.breps;

	if (req.body.dweight == '') dweight = 'NULL';
	else dweight = req.body.dweight;
	
	if (req.body.dsets == '') dsets = 'NULL';
	else dsets = req.body.dsets;
	
	if (req.body.dreps == '') dreps = 'NULL';
	else dreps = req.body.dreps;

	if (req.body.sweight == '') sweight = 'NULL';
	else sweight = req.body.sweight;
	
	if (req.body.ssets == '') ssets = 'NULL';
	else ssets = req.body.ssets;
	
	if (req.body.sreps == '') sreps = 'NULL';
	else sreps = req.body.sreps;		
	if (date == ''){
		console.log('date error');
		res.write("You Must Select A Date");
		return res.end();
	} else if (bweight == 'NULL' && bsets == 'NULL' && breps == 'NULL' && dweight == 'NULL' && dsets == 'NULL' && dreps == 'NULL' && sweight == 'NULL' && ssets == 'NULL' && sreps == 'NULL'){
		console.log("Can't Log An Empty Workout");
		res.write("Can't Log An Empty Workout");
		return res.end();
	} else if((bweight == 'NULL' || bsets == 'NULL' || breps == 'NULL') && !(bweight == 'NULL' && bsets == 'NULL' && breps == 'NULL')){
		console.log('bench error');
		res.write("You Are Missing Fields In Recording Benchpress");
		return res.end();
	} else if((dweight == 'NULL' || dsets == 'NULL' || dreps == 'NULL') && !(dweight == 'NULL' && dsets == 'NULL' && dreps == 'NULL')){
		res.write("You Are Missing Fields In Recording Deadlifts");
		return res.end();
	} else if ((sweight == 'NULL' || ssets == 'NULL' || sreps == 'NULL') && !(sweight == 'NULL' && ssets == 'NULL' && sreps == 'NULL')){
		res.write("You Are Missing Fields In Recording Squats");
		return res.end();
	} else {
		db.createWorkout(user,date,bweight,bsets,breps,dweight,dsets,dreps,sweight,ssets,sreps,function(results){
			if (results == 'true'){
				db.updateBenchPR(user, function(results1){});
				db.updateSquatPR(user, function(results2){});
				db.updateDeadPR(user, function(results3){});	
				res.write("Successfully Logged A Workout");
			} 
			else{ 
				res.write("Ooops! Could Not Log Workout");
			}
		
			return res.end();
		});
	}
});

app.delete('/DeleteWorkoutLog', function(req,res){
	db.deleteWorkoutLog(user, req.body.datelog, function(results){
		if (results == 'true'){
			res.write('Workout Log Cleared');
		} else{
			res.write('Oops! Could Not Delete Workout');
		}
		return res.end();
	});
	
});


//////HTML PAGES ///////

app.get('*',function(req,res){
	load(req, res);
});

/************HELPER************************/

function load(req, res){

	var query = url.parse(req.url, true);
	var file = "." + query.pathname;
	
	if (lock && (file != './images/bg/workout-1.jpg' && file != './login.js' && file != './register.js' && file != './register.html' && file != './login.html')) file = './login.html';
	
	if (!lock && (file == './login.html' || file == './register.html')) file = './home.html';
	 
	fs.readFile(file, function(err, data) {
		
		if (err) {
			fs.readFile("./page404.html",function(err1,data1){
				if (err1) throw err1;
				res.writeHead(404, {"Content-Type": "text/html"});
				res.write(data1);
				return res.end();
			});
		} else {
		
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(data);
 		return res.end();
 		} 		
	} );
}

function readFile(file) { return fs.readFileSync(file, "utf8"); }

function route(pathname) {}
exports.route = route;
module.exports.readFile = readFile;
