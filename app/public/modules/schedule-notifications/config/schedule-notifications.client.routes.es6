'use strict';

//Setting up route
angular.module('schedule-notifications').config(['$stateProvider',
	function ($stateProvider) {
		// view scheme is: "viewname@statename"
		// "viewname@" renders into the ui-view='viewname' of the root template
		$stateProvider
			.state('overdue', {
				url: '/overdue',
				views: {
					'aside@': {
						templateUrl: 'modules/schedule-notifications/views/list-notifications.client.view.html'
					},
					'main-view@': {
						templateUrl: 'modules/calendar/views/calendar.client.view.html'
					}
				},
				data: {
					menuLabel: "track progress"
				}
			})
			.state('overdue.edit', {
				url: '/:taskId/edit',
				views: {
					'aside@': {
						templateUrl: 'modules/schedule-notifications/views/list-notifications.client.view.html'
					},
					'main-view@': {
						templateUrl: 'modules/tasks/views/edit-task.client.view.html'
					}
				}
			});
	}
]);
