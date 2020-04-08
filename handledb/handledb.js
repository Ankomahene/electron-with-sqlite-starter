const { uniqueNamesGenerator, names } = require('unique-names-generator');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('usersdb.sqlite3');

getName = () => {
	const uniqueName = uniqueNamesGenerator({
		dictionaries: [ names ],
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
	db.serialize(function() {
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
		db.each('SELECT id, name, age FROM users', function(err, row) {
			var item = document.createElement('li');
			item.textContent = '' + row.id + ': ' + row.name + ' - ' + row.age + ' years';
			rows.appendChild(item);
		});
	});

	db.close();
};
