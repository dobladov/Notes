
var notesController = angular.module('notesController', []);


// All Notes
notesController.controller('notesCtrl', ['$scope', "Notes", "Categories", "$location", function($scope, Notes, Categories, $location) {

	document.body.style.backgroundColor = "#F5F5F5";

	$scope.categories = [];
	$scope.category = {};
	$scope.order = "+";
	$scope.orderType = "title";

	loadData();

 	function loadData(last) {

 		var defaultCategories = [{"id": 0, "name":"All"},
					   {"id": "-1", "name":"Trash"},
					   {"id": "-2", "name":"Archived"},
					   {"id": "-3", "name":"Uncategorized"},
					   {"id": "null", "name":"──────────"}];
	
		$scope.categories = defaultCategories;
	
		Categories.getCategories().then(function(result) {
			$scope.categories = defaultCategories;

			if (result.length == 0) {
				$scope.categories.pop();
			}

			$scope.categories.push.apply($scope.categories, result);

			if (last) {
				$scope.category = $scope.categories[$scope.categories.length-1];
			} else {
				$scope.category = $scope.categories[0];
			}

			Notes.getNotes($scope.category.id).then(function(result) {
		    	$scope.notes = result;
		 	});
	 	});

 	};

 	$scope.categorySelected = function() {

 		Notes.getNotes($scope.category.id).then(function(result) {
	    	$scope.notes = result;
	 	});

 	};

 	$scope.newCategoryData = {};

 	$scope.newCategory = function() {

		Categories.newCategory($scope.newCategoryData.name).then(function(result) {
    		if (result) {
    			
    			loadData(true);	
    			$scope.newCategory = {};
    		}
 		});
	};

	$scope.updateCategory = function() {

		Categories.updateCategory($scope.category.id, $scope.newName).then(function(result) {
    		if (result) {
    			loadData();	
    		}
 		});
	};

	$scope.deleteCategory = function() {

		Categories.deleteCategory($scope.category.id).then(function(result) {

	   		if (result) {
				loadData();
    		}
 		});
	};

}]);


// View Note
notesController.controller('noteCtrl', ['$scope', "Notes", '$routeParams', '$location', "Categories", function($scope, Notes, $routeParams, $location, Categories) {
	
	$scope.categories = [];
	$scope.category = "";

	loadNote();

 	function loadNote() {

		Notes.getNote($routeParams.noteId).then(function(result) {
	    	$scope.note = result;
	    	$scope.category = $scope.note.categoryID;

			document.body.style.backgroundColor = ColorLuminance($scope.note.color, 0.3) || "#ffea4c";
	 		loadCategories();

	 	});

 	};

 	function loadCategories() {

	 	var defaultCategories = [{"id": 0, "name":"None"},
								{"id": "null", "name":"──────────"}];
	
		$scope.categories = defaultCategories;

		Categories.getCategories().then(function(result) {
			$scope.categories = defaultCategories;


			if (result.length == 0) {
				$scope.categories.pop();
			}

			$scope.categories.push.apply($scope.categories, result);

			$scope.categories.forEach(function(element) {

				if (element.id == $scope.note.categoryID) {
					$scope.category = element;
				}
		    
			});
		});
 	};


 	$scope.deleteNote = function() {

		Notes.deleteNote($scope.note.id).then(function(result) {
    		if (result) {
    			$location.path('/notes');
    		}
 		});
	};

	$scope.archiveNote = function() {

		Notes.archiveNote($scope.note.id).then(function(result) {
    		if (result) {
    			$location.path('/notes');
    		}
 		});
	};

	$scope.restoreNote = function() {

		Notes.restoreNote($scope.note.id).then(function(result) {
    		if (result) {
    			$location.path('/notes');
    		}
 		});
	};


	$scope.unarchiveNote = function() {

		Notes.unarchiveNote($scope.note.id).then(function(result) {
    		if (result) {
    			$location.path('/notes');
    		}
 		});
	};

	$scope.permanentDeleteNote = function() {

		Notes.permanentDeleteNote($scope.note.id).then(function(result) {
    		if (result) {
    			$location.path('/notes');
    		}
 		});
	};

	$scope.changeCategory = function() {

		Notes.changeCategory($scope.note.id, $scope.category.id).then(function(result) {
    		if (result) {
   				loadNote();
    		}
 		});
	};

	$scope.changeColor = function() {

		document.body.style.backgroundColor = ColorLuminance($scope.note.color, 0.5);

		Notes.changeColor($scope.note.id, $scope.note.color).then(function(result) {
    		if (result) {
    		}
 		});

	};

	$scope.toJsDate = function(str) {
		if (!str) return null;
			return new Date(str);
	};

}]);


// New Note
notesController.controller('noteNewCtrl', ['$scope', "Notes", "$location", "$routeParams", function($scope, Notes, $location, $routeParams) {

	$scope.back = "#/notes";
	$scope.newDisable = false;
	
	$scope.newNote = function() {

		console.log("Click");
		
		$scope.newDisable = true;

		var categoryNew = 0;

 		if ($routeParams.categotyID >= 0 ) {
 			categoryNew = $routeParams.categotyID;
 		}

		Notes.createNote($scope.note.title, $scope.note.content, categoryNew).then(function(result) {
    		if (result) {
    			$location.path('/notes');
    		}
 		});
	};

}]);


notesController.controller('noteEditCtrl', ['$scope', "Notes", '$routeParams', "$location", function($scope, Notes, $routeParams, $location) {

	$scope.back = "#/note/"+ $routeParams.noteId;	

	Notes.getNote($routeParams.noteId).then(function(result) {
    	$scope.note = result;
 	});

 	$scope.updateNote = function() {

		Notes.updateNote($scope.note.id, $scope.note.title, $scope.note.content).then(function(result) {
    		if (result) {
    			$location.path('/note/' + $scope.note.id);
    		}
 		});
	};

}]);


notesController.controller('noteSaveCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.noteId = $routeParams.noteId;
}]);

notesController.controller('noteDeleteCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.noteId = $routeParams.noteId;
}]);