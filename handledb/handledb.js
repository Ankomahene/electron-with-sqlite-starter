const { uniqueNamesGenerator, names } = require('unique-names-generator');
var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('usersdb.sqlite3');
var db = new sqlite3.Database('sampledb.db');

getName = () => {
	const uniqueName = uniqueNamesGenerator({
		dictionaries: [names],
		length: 1
	});
	return uniqueName;
};

const getAge = (min = 18, max = 55) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

module.exports.handleDatabase = () => {
	db.serialize(function () {
		// drop table if created already
		db.run('DROP TABLE IF EXISTS users');

		// re-create table to add new data
		db.run('CREATE TABLE IF NOT EXISTS users (id INT, name TEXT,  age INT)');

		// add data to table
		var stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?)');

		for (var i = 0; i < 20; i++) {
			stmt.run(i, getName(), getAge());
		}

		stmt.finalize();

		var rows = document.getElementById('users');
		db.each('SELECT id, name, age FROM users', function (err, row) {
			var item = document.createElement('li');
			item.textContent = '' + row.id + ': ' + row.name + ' - ' + row.age + ' years';
			rows.appendChild(item);
		});
	});

	db.close();
};


module.exports.login = (username, password) => {
	db.get('select * from users where username = ? and password = ?', [username, password], (error, row) => {
		if (error) {
			console.log(error.message)
			return error.message
		}

		return row ? console.log(row) : console.log("No user defined like that")
	})

	// db.close()
}

module.exports.resetPassword = () => {

}

module.exports.addStudent = (full_name, dob, gender, stage) => {
	let statement = 'INSERT INTO `students` (full_name,dob,gender,class) VALUES(?,?,?,?);'

	db.run(statement, [full_name, dob, gender, stage], (error) => {
		if (error) {
			return error.message
		}

		console.log("Student added successfully")
	})
}
module.exports.viewAllStudents = () => {
	// It views just the student details for now and then his class,
	let statement = 'select students.*, classes.name as class_name from students inner join classes on `students`.class=`classes`.id;'
	let temporaryHolder = []
	db.each(statement, (error, row) => {
		if (error) {
			console.log(error)
		}
		temporaryHolder.push(row)
	})
	console.log(temporaryHolder)
}
module.exports.getStudentById = (studentId) => {
	// this is the raw thing. refinement can be added later
	let statement = "select * from students where students.id=? and deleted =0;"
	db.get(statement, [studentId], (error) => {
		if (error) {
			console.log(error)
		}
		console.log(row)
	})
}
module.exports.getStudentByGender = (gender) => {
	let statement = "select * from students where students.gender = ? and deleted =0;"
	let temporaryHolder = []
	db.each(statement, [gender], (error, rows) => {
		if (error) {
			console.log(error.message)
		}
		temporaryHolder.push(rows)
	})
	console.log(temporaryHolder)
}
module.exports.viewStudentsByClass = (stage) => {
	let statement = "select * from students where class = ? and deleted = 0;"
	let temporaryHolder = []
	db.each(statement, [stage], (error, rows) => {
		if (error) {
			console.log(error.message)
		}
		temporaryHolder.push(rows)
	})
	console.log(temporaryHolder)
}
module.exports.deleteStudentById = (studentId) => {
	let statement = "update students set deleted = ? where students.id = ?;"
	db.run(statement, [1, studentId], (error, rows) => {
		if (error) {
			console.log(error.message)
		}
		console.log(rows)
	})
}
module.exports.updateStudentInfo = (name, studentId) => {
	// this functions seems a bit open beccause i dont really know what is to be updated in the db
	let statement = 'update students set full_name=? where students.id =?;'
	db.run(statement, [name, studentId], (error, rows) => {
		if (error) {
			console.log(error.message)
		}
		console.log(rows)
	})
}
module.exports.countAll = () => {
	let statement = "select count(*) from students where deleted = 0;"
	let temporaryHolder = []
	db.each(statement, (error, rows) => {
		if (error) {
			console.log(error.message)
		}
		temporaryHolder.push(rows)
	})
	console.log(temporaryHolder)
}

module.exports.countByGender = (gender) => {
	let statement = "select count(*) from students where deleted = 0 and gender = ?;"
	let temporaryHolder = []
	db.each(statement, [gender], (error, rows) => {
		if (error) {
			console.log(error.message)
		}
		temporaryHolder.push(rows)
	})
	console.log(temporaryHolder)
}

module.exports.percentageOfMales = () => {

}

module.exports.countByGenderInClass = (gender, stage) => {
	let statement = "select count(*) from students where deleted = 0 and gender = ? and class = ?;s"
	let temporaryHolder = []
	db.each(statement, [gender, stage], (error, rows) => {
		if (error) {
			console.log(error.message)
		}
		temporaryHolder.push(rows)
	})
	console.log(temporaryHolder)
}


