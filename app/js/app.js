var noteApp = angular.module('notesApp', [
	'ngRoute',
	'notesController',
	'notesServices',
	'colorFilter',
	'ngSanitize',
	'btford.markdown'
]);

noteApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/notes', {
			templateUrl: 'partials/notes.html',
			controller: 'notesCtrl'
		}).
		when('/note/new/:categotyID', {
			templateUrl: 'partials/noteEdit.html',
			controller: 'noteNewCtrl'
		}).
		when('/note/:noteId', {
			templateUrl: 'partials/note.html',
			controller: 'noteCtrl'
		}).
		when('/note/edit/:noteId', {
			templateUrl: 'partials/noteEdit.html',
			controller: 'noteEditCtrl'
		}).
		when('/note/save/:noteId', {
			templateUrl: 'partials/note.html',
			controller: 'noteSaveCtrl'
		}).
		otherwise({
			redirectTo:'/notes'
		});
}]);