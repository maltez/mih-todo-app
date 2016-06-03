'use strict';

// Tasks controller

angular.module('tasks').controller('TasksListController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Tasks', function ($scope, $rootScope, $stateParams, $location, Authentication, Tasks) {
	$scope.authentication = Authentication;

	$rootScope.$on('NEW_TASK_MODIFY', function () {
		$scope.find();
	});

	$scope.showCompleted = false;

	$scope.sortBy = {
		type: 'deadline'
	};

	// Find a list of Tasks
	$scope.find = function () {
		$scope.tasks = Tasks.query();
	};

}]);
