'use strict';

//Notifications service used to communicate Notifications REST endpoints
angular.module('notifications').factory('Notifications', ['$resource',
	function($resource) {
        var currentTime = new Date();

		return $resource('notifications/:notificationId', { notificationId: '@_id', time: currentTime
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);