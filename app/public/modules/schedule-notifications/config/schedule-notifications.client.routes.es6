'use strict';

//Setting up route
angular.module('schedule-notifications').config(['$stateProvider',
	function ($stateProvider) {
		// todo remove redundant states
		// Notifications state routing

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
						templateUrl: 'modules/schedule-notifications/views/list-notifications.client.view.html'
					}
				},
				data: {
					menuLabel: "overdue"
				}
			})
			.state('overdue.create', {
				url: '/create',
				views: {
					'main-view@': {
						templateUrl: 'modules/schedule-notifications/views/create-notification.client.view.html'
					}
				}
			})
			.state('overdue.view', {
				url: '/:notificationId',
				views: {
					'main-view@': {
						templateUrl: 'modules/schedule-notifications/views/view-notification.client.view.html'
					}
				}
			})
			.state('overdue.edit', {
				url: '/:notificationId/edit',
				views: {
					'main-view@': {
						templateUrl: 'modules/schedule-notifications/views/edit-notification.client.view.html'
					}
				}
			})
		;
	}
]);
