'use strict';

// Notifications controller
angular.module('tasks').directive('taskProgress', function(){
	return {
		restrict: 'EA',
		controller: 'TasksController',
		templateUrl: '/modules/tasks/views/task-progress.client.view.html'
	};
});
