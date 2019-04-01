class DataBase{

	//database constructor
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
	
	//Disconnecter
	disconnect(){
		this.con.end();
	}
	
	//Reconnecter
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
	
	//Create new user.
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
	
	createProfile(user){
		var sql = "INSERT INTO  profiles (username) VALUES ('" + user + "')";
		this.con.query(sql,function(err,results,field){
			if(err) throw err;
		});
	}
	

	updateProfile(user, fname, lname, birthday, weight, height){
		var sql;
		if (birthday == 'NULL') sql="UPDATE profiles SET fname='"+fname+"', lname='"+lname+"', birthday="+birthday+", weight="+weight+",height="+height+" WHERE username='"+user+"'";
		else sql= "UPDATE profiles SET fname='"+fname+"', lname='"+lname+"', birthday='"+birthday+"', weight="+weight+",height="+height+" WHERE username='"+user+"'";
		this.con.query(sql,function(err,results,field){
			if(err) throw err;
		}); 	
	}	
	
	
	loadProfile(user, callback){
		var sql = "SELECT * FROM profiles WHERE username='"+user+"'";
		this.con.query(sql,function(err,results){
			if (err) throw err;
			return callback(results);
		});
	}
	
	changeUserPassword(user, pw){
		var sql = "UPDATE logins SET password = '" + pw + "' WHERE username = '" + user + "'";
		this.con.query(sql, function(err, results){
			if (err) throw err;
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
	
	createWorkoutLog(user){
		var sql = "CREATE TABLE "+user+"_WorkoutLogs (datelog DATE, bweight FLOAT, bsets INT, breps INT, dweight FLOAT, dsets INT, dreps INT, sweight FLOAT, ssets INT, sreps INT)";
		this.con.query(sql,function(err,results){
			if (err) throw err;
		}); 
	}
	
	createWorkout(user, date, bweight, bsets, breps, dweight, dsets, dreps, sweight, ssets, sreps, callback){
		var sql;
		if (date == "NULL") sql= "INSERT INTO "+user+"_WorkoutLogs (datelog, bweight, bsets, breps, dweight, dsets, dreps, sweight, ssets, sreps) VALUES ("+date+","+bweight+","+bsets+","+breps+","+dweight+","+dsets+","+dreps+","+sweight+","+ssets+","+sreps+")";
		else sql="INSERT INTO "+user+"_WorkoutLogs (datelog, bweight, bsets, breps, dweight, dsets, dreps, sweight, ssets, sreps) VALUES ('"+date+"',"+bweight+","+bsets+","+breps+","+dweight+","+dsets+","+dreps+","+sweight+","+ssets+","+sreps+")";
		this.con.query(sql,function(err,results){
			if (err){
				return callback('false');
			} else {
				return callback('true');
			}
		});
	}
	
	updateBenchPR(user, callback){
		var sql="UPDATE profiles SET bench = (SELECT max(bweight) from "+user+"_WorkoutLogs) where username = '"+user+"'";
		this.con.query(sql, function(err,results){
			if (err){
				throw err;
			}else{
				return callback('true');
			}
		});
	}
	
	updateSquatPR(user,callback){
		var sql="UPDATE profiles SET squat = (SELECT max(sweight) from "+user+"_WorkoutLogs) where username = '"+user+"'";
		this.con.query(sql, function(err,results){
			if (err){
				throw err;
			}else{
				return callback('true');
			}
		});
	}
	
	updateDeadPR(user,callback){
		var sql="UPDATE profiles SET dead = (SELECT max(dweight) from "+user+"_WorkoutLogs) where username = '"+user+"'";
		this.con.query(sql, function(err,results){
			if (err){
				throw err;
			}else{
				return callback('true');
			}
		});
	}
	
	selectWorkoutLog(user,date,callback){
		var sql="SELECT * FROM "+user+"_WorkoutLogs WHERE datelog='"+date+"'";
		this.con.query(sql,function(err,results){
			return callback(results);
		});
	}
	
	deleteWorkoutLog(user,date,callback){
		var sql="DELETE FROM "+user+"_WorkoutLogs WHERE datelog='"+date+"'";
		this.con.query(sql, function(err,results){
			if (err) return callback('false');
			return callback('true');
		});
	}
	
	deleteLogin(user){
		var sql = "DELETE FROM logins WHERE username = '"+user+"'"; 
	
	}
	
	deleteProfile(user){
		var sql = "DELETE FROM profiles WHERE username = '"+user+"'";
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

}

module.exports = DataBase
