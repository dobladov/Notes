

var notesServices = angular.module('notesServices', ['ngResource']);

notesServices.factory('Notes', ["$q", function($q) {
    return {
        
        createNote: function(title, content, category) {

			var deferred = $q.defer();

			db.run("INSERT OR IGNORE INTO notes (title, content, deleted, archived, date, categoryID, color) VALUES (?, ?, 0, 0, CURRENT_TIMESTAMP, ?, '#ffea4c')", [title, content, category], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});
			return deferred.promise;
		},

		getNote: function(id) {

			var deferred = $q.defer();

			db.get("SELECT rowid as id, * FROM notes WHERE rowid = ? LIMIT 1", [id], function(err, row) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(row);
				}
			});
			return deferred.promise;
		},

		getNotes: function(category) {

			var query = "";

			switch (category) {
				case 0:
					query = "SELECT rowid AS id, * FROM notes where deleted = 0 and archived = 0";
					break;
				case "-1":
					query = "SELECT rowid AS id, * FROM notes where deleted = 1";
					break;
				case "-2":
					query = "SELECT rowid AS id, * FROM notes where deleted = 0 and archived = 1";
					break;
				case "-3":
					query = "SELECT rowid AS id, * FROM notes where deleted = 0 and archived = 0 and categoryID = 0" ;
					break;
				default:
					query = "SELECT rowid AS id, * FROM notes where deleted = 0 and categoryID = "+ category;
			}

			var deferred = $q.defer();

			db.all(query, function(err, rows) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(rows);
				}
			});

			return deferred.promise;
		},

		updateNote: function(idNote, title, content) {

			var deferred = $q.defer();

			db.run("UPDATE notes set title = (?), content = (?), date = CURRENT_TIMESTAMP WHERE rowid= (?)", [title, content, idNote], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		},

		archiveNote: function(idNote) {

			var deferred = $q.defer();

			db.run("UPDATE notes set archived = 1 WHERE rowid = (?)", [idNote], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		},

		deleteNote: function(idNote) {

			var deferred = $q.defer();

			db.run("UPDATE notes set deleted = 1 WHERE rowid = (?)", [idNote], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		},

		restoreNote: function(idNote) {

			var deferred = $q.defer();

			db.run("UPDATE notes set deleted = 0 WHERE rowid = (?)", [idNote], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		},

		unarchiveNote: function(idNote) {

			var deferred = $q.defer();

			db.run("UPDATE notes set archived = 0 WHERE rowid = (?)", [idNote], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		},


		permanentDeleteNote: function(id) {

			var deferred = $q.defer();

			db.run("DELETE FROM notes WHERE rowid = (?)", [id], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		},

		changeCategory: function(idNote, categoryID) {

			var deferred = $q.defer();

			db.run("UPDATE notes set categoryID = (?) WHERE rowid = (?)", [categoryID, idNote], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		},

		changeColor: function(idNote, color) {

			var deferred = $q.defer();

			db.run("UPDATE notes set color = (?) WHERE rowid = (?)", [color, idNote], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		}

    };
}]);

notesServices.factory('Categories', ["$q", function($q) {
    return {
        
		getCategories: function() {

			var deferred = $q.defer();

			db.all("SELECT rowid AS id, * FROM categories", function(err, rows) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(rows);
				}
			});

			return deferred.promise;
		},

		newCategory: function(name) {

			var deferred = $q.defer();

			db.run("INSERT OR IGNORE INTO categories (name) VALUES (?)", [name], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});
			return deferred.promise;
		},


		deleteCategory: function(id) {

			var deferred = $q.defer();

			db.run("DELETE FROM categories WHERE rowid = (?)", [id], function(err) {
				if (err) {
					console.log(err);
				} else {
					db.run("UPDATE notes set categoryID = 0 WHERE categoryID = (?)", [id], function(err) {
						if (err) {
							console.log(err);
						} else {
							deferred.resolve(true);
						}
					});
				}
			});

			return deferred.promise;
		},

		updateCategory: function(id, name) {

			var deferred = $q.defer();

			db.run("UPDATE categories set name = (?) WHERE rowid= (?)", [name, id], function(err) {
				if (err) {
					console.log(err);
				} else {
					deferred.resolve(true);
				}
			});

			return deferred.promise;
		}

	};
}]);
