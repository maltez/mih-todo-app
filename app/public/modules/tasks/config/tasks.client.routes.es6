'use strict';

//Setting up route
angular.module('tasks').config(['$stateProvider',
	function($stateProvider) {
		// Tasks state routing
		$stateProvider.
		state('listTasks', {
			url: '/tasks',
			views: {
				'aside': { templateUrl: 'modules/core/views/todo.client.view.html' },
				'': { templateUrl: 'modules/tasks/views/list-tasks.client.view.html' }
			}
		}).
		state('createTask', {
			url: '/tasks/create',
			views: {
				'aside': { templateUrl: 'modules/core/views/todo.client.view.html' },
				'': { templateUrl: 'modules/tasks/views/create-task.client.view.html' }
			}

		}).
		state('viewTask', {
			url: '/tasks/:taskId',
			views: {
				'aside': { templateUrl: 'modules/core/views/todo.client.view.html' },
				'': { templateUrl: 'modules/tasks/views/view-task.client.view.html' }
			}
		}).
		state('editTask', {
			url: '/tasks/:taskId/edit',
			views: {
				'aside': { templateUrl: 'modules/core/views/todo.client.view.html' },
				'': { templateUrl: 'modules/tasks/views/edit-task.client.view.html' }
			}
		});
	}
]);
