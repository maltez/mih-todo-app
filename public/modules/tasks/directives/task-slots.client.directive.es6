'use strict';

angular.module('tasks').directive('taskSlots', function(){
	return {
		restrict: 'EA',
		controller: 'TasksController',
		templateUrl: '/modules/tasks/views/task-slots.client.view.html'
	};
});
