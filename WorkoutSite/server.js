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

///////AJAX Responses ///////

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
	db.createProfile(req.body.User);
	db.createUser(req.body.User, req.body.Password, function(results){
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

app.get('/SignOut', function(req,res){
	lock = true;
	res.write("true");
	return res.end();
});


app.get('/HighFilter', function(req,res){
	var chatRooms = '';
	db.filterHighChatRooms(function(results){
		for (var i = 0; i < results.length; i ++){
			chatRooms += results[i];
			if (i < results.length -1) chatRooms = chatRooms + '\n'
		}
		res.write(chatRooms);
		return res.end();
	});
});

app.get('/LoadChatRooms', function(req,res){
	var chatRooms = '';
	db.showAllChatRooms(function(results){
		for (var i = 0; i < results.length; i ++){
			chatRooms += results[i];
			if (i < results.length -1) chatRooms = chatRooms + '\n'
		}
		res.write(chatRooms);
		return res.end();
	});
});

app.get('/LowFilter', function(req,res){
	var chatRooms = '';
	db.filterLowChatRooms(function(results){
		for (var i = 0; i < results.length; i ++){
			chatRooms += results[i];
			if (i < results.length -1) chatRooms = chatRooms + '\n'
		}
		res.write(chatRooms);
		return res.end();
	});
});


app.get('/LoadDropDownMenu', function(req,res){
	var chatRooms = '<option value = "" disabled selected> Please Select a Message Board </option>';
		db.showAllChatRooms(function(results){
		
		for (var i = 0; i < results.length; i ++){
			chatRooms += '<option value="' + results[i] + '">' + results[i] + '</option>'
		}
		res.write(chatRooms);
		return res.end();
	});
});

app.post('/CreateChatRoom', function(req, res){
	db.createChatRoom(req.body.NewChatRoom);
	var chatRooms = '';
	db.showAllChatRooms(function(results){
		for (var i = 0; i < results.length; i ++){
			chatRooms += results[i];
			if (i < results.length -1) chatRooms += '\n'
		}
		res.write(chatRooms);
		return res.end();
	});
});

app.delete('/DeleteChatRoom', function (req, res){
	db.deleteChatRoom(req.body.ChatRoom);
	var chatRooms = '<option value = "" disabled selected> Please Select a Message Board </option>';
	db.showAllChatRooms(function(results){
		for (var i = 0; i < results.length; i ++){
			chatRooms += '<option value="' + results[i] + '">' + results[i] + '</option>'
		}
		res.write(chatRooms);
		return res.end();
	});
});

app.get('/ShowAllMessages', function(req,res){
	var Url = url.parse(req.url, true);
	var query = Url.query;
	var messages = '';
	
	db.showAllMessages(query.ChatRoom, function(results){
		for (var i = 0; i < results.length; i ++){
			messages += results[i].time.toISOString().slice(0, 19).replace('T', ' ') + ": \n \t" + results[i].message + '\n\n';
		}
		res.write(messages);
		return res.end();
	});
});

app.post('/CreateMessage', function(req,res){
	var bod = req.body;
	var messages = '';
	db.createMessage(bod.ChatRoom, bod.Message, bod.Time);
	db.showAllMessages(bod.ChatRoom, function(results){
		for (var i = 0; i < results.length; i ++){
			messages += results[i].time.toISOString().slice(0, 19).replace('T', ' ') + ": \n \t" + results[i].message + '\n\n';
		}
		res.write(messages);
		return res.end();
	});
});


//////HTML PAGES ///////

app.get('/vieworkouts.html', 

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
