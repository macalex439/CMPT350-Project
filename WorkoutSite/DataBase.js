class DataBase{

	constructor(h, u, pw, db){
		this.mysql = require('mysql');
		

		this.con = this.mysql.createConnection({
	
			host: h,
			user: u,
			password:pw,
			database: db
		});

		this.con.connect(function(errConnect){
			if (errConnect) throw errConnect;
			console.log("Connected to the DataBase");
		});
	
	}
	
	disconnect(){
		this.con.end();
	}
	
	reconnect(h,u,pw,db){
		this.con = this.mysql.createConnection({
	
			host: h,
			user: u,
			password:pw,
			database: db
		});

		this.con.connect(function(errConnect){
			if (errConnect) throw errConnect;
			console.log("Connected to the DataBase");
		});
	
	}
	
	createUser(user, pw, callback){
		var sql = "INSERT INTO logins (username, password) VALUES ('" + user + "', '" + pw + "')";
		this.con.query(sql, function(err, results, fields){
			if (err){
				if (err.code == 'ER_DUP_ENTRY') return callback('false');
				else throw err;
			} else {	
				return callback('true');
			}
		});
	}
	checkUserAuth(user, callback){
		var sql = "SELECT password FROM logins WHERE username= '" + user + "'";
		this.con.query(sql, function(err, results, fields){
			if (err) throw err;
			if (results[0]){
				return callback(results[0].password);
			} else{
			 	return callback(results);
			 }
			
		});
	}
	
	createMessage(roomName, message, date){
		var sql = "INSERT INTO " + roomName + " (message, time) VALUES ('" + message + "', '" + date + "')";
		this.con.query(sql, function(err, results, fields){
			if (err) throw err;
		});
		sql = "UPDATE Chatrooms SET activity = (SELECT count(*) FROM " + roomName + ") WHERE roomname = '" + roomName + "'";
		this.con.query(sql, function(err, results){
			if (err) throw err;
		});
	}
	
	showAllMessages(roomName, callback){
		var sql = "SELECT * FROM " + roomName + " ORDER BY time ASC";
		this.con.query(sql, function(err, results, fields){
			if (err) throw err;
			
			var chatRooms = [];
			for (var i = 0; i < results.length; i++){
				chatRooms.push(results[i]);
			}
			return callback(chatRooms);
		});
	}
	
	createChatRoom(roomName){
		var sql = "CREATE TABLE " + roomName + " (message VARCHAR(255), time DATETIME)";
		this.con.query(sql, function(err,results, fields){
			if (err) throw err;
			console.log("Table Created");
		});
		
		sql = "INSERT INTO Chatrooms (roomname, activity) VALUES ('" + roomName + "', 0)";
		this.con.query(sql, function(err, results){
			if (err) throw err;
		});
	}
	
	deleteChatRoom(roomName){
		if (roomName == 'Chatrooms') return;
		
		var sql = "DROP TABLE IF EXISTS " + roomName;
		this.con.query(sql,function(err,results,fields){
			if (err) throw err;
			console.log("Table Removed");
		});
		
		sql = "DELETE FROM Chatrooms WHERE roomname = '" + roomName + "'";
		this.con.query(sql,function(err, results){
			if (err) throw err;
		});
	}
		
	
	showAllChatRooms(callback){
		var sql = "SELECT roomname FROM Chatrooms ORDER BY roomname";
		this.con.query(sql, function(err,results, fields){
			if (err) throw err;
			
			var chatRooms = [];
			for (var i = 0; i < results.length; i ++){
				chatRooms.push(results[i].roomname);
			}
			return callback(chatRooms);
		});
	}
	
	filterLowChatRooms(callback){
		var sql = "SELECT roomname FROM Chatrooms ORDER BY activity ASC";
		this.con.query(sql, function(err,results, fields){
			if (err) throw err;
			
			var chatRooms = [];
			for (var i = 0; i < results.length; i ++){
				chatRooms.push(results[i].roomname);
			}
			return callback(chatRooms);
		});
	}
	
	filterHighChatRooms(callback){
		var sql = "SELECT roomname FROM Chatrooms ORDER BY activity DESC";
		this.con.query(sql, function(err,results, fields){
			if (err) throw err;
			
			var chatRooms = [];
			for (var i = 0; i < results.length; i ++){
				chatRooms.push(results[i].roomname);
			}
			return callback(chatRooms);
		});
	}
}

module.exports = DataBase
