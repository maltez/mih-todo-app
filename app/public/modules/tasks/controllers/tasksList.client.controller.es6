'use strict';

// Tasks controller

angular.module('tasks').controller('TasksListController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Tasks', function ($scope, $rootScope, $stateParams, $location, Authentication, Tasks) {
	$scope.authentication = Authentication;

	$rootScope.$on('NEW_TASK_MODIFY', function () {
		$scope.find();
	});

	$scope.sortType = 'deadline';
	$scope.sortReverse = false;

	$scope.sortListBy = function(type){
		$scope.sortType = type;
		$scope.sortReverse = !$scope.sortReverse;
	};

	// Find a list of Tasks
	$scope.find = function () {
		$scope.tasks = Tasks.query();
	};

	$scope.getTaskDonePercentage = task => {
		return (task.progress * 100) / task.estimation;
	}
}]);
