'use strict';

//Notifications service used to communicate Notifications REST endpoints
angular.module('schedule-notifications').factory('ScheduleNotifications', ['$resource',
	function ($resource) {
		var currentTime = new Date();

		return $resource('notifications/:notificationId', {
			notificationId: '@_id',
			time: currentTime
		}, {
			query: {isArray: false}
		});
	}
]);
