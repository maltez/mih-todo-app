'use strict';

//Setting up route
angular.module('schedule-notifications').config(['$stateProvider',
	function ($stateProvider) {
		// todo remove redundant states
		// Notifications state routing
		$stateProvider
			.state('listNotifications', {
				url: '/notifications',
				views: {
					'aside': {templateUrl: 'modules/core/views/todo.client.view.html'},
					'': {templateUrl: 'modules/schedule-notifications/views/list-notifications.client.view.html'}
				}
			})
			.state('createNotification', {
				url: '/notifications/create',
				templateUrl: 'modules/schedule-notifications/views/create-notification.client.view.html'
			})
			.state('viewNotification', {
				url: '/notifications/:notificationId',
				views: {
					'aside': {templateUrl: 'modules/core/views/todo.client.view.html'},
					'': {templateUrl: 'modules/schedule-notifications/views/view-notification.client.view.html'}
				}
			})
			.state('editNotification', {
				url: '/notifications/:notificationId/edit',
				templateUrl: 'modules/schedule-notifications/views/edit-notification.client.view.html'
			});
	}
]);
