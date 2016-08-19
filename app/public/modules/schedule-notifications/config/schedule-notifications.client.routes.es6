'use strict';

//Setting up route
angular.module('schedule-notifications').config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider
			.state('listNotifications', {
				url: '/notifications',
				views: {
					'aside': {templateUrl: 'modules/core/views/todo.client.view.html'},
					'': {templateUrl: 'modules/schedule-notifications/views/list-notifications.client.view.html'}
				},
				params: {
					category: 'overdue'
				}
			})
			.state('editTaskFromOverdue', {
				url: '/notifications/:taskId/edit',
				views: {
					'aside': { templateUrl: 'modules/core/views/todo.client.view.html' },
					'': { templateUrl: 'modules/tasks/views/edit-task.client.view.html' }
				},
				params: {
					category: 'overdue'
				}
			});
	}
]);
