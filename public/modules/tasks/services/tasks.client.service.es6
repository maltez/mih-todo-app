//Tasks service used to communicate Tasks REST endpoints
'use strict';

angular.module('tasks').factory('Tasks', ['$resource',
	function ($resource) {
		return $resource('tasks/:taskId', {taskId: '@_id'}, {
			update: {
				method: 'PUT'
			},
			'getSlotsByTask': {
				url: 'tasks-slots/:id',
				method: 'GET',
				isArray: true
			},
			'deleteSlotsByTask': {
				url: 'tasks-slots/:id',
				method: 'DELETE'
			}
		});
	}
]);
