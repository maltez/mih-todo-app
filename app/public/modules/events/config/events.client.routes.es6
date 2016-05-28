'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		// Events state routing
		$stateProvider.
		state('listEvents', {
			url: '/events',
			views: {
				'aside': {templateUrl: 'modules/core/views/todo.client.view.html'},
				'': {templateUrl: 'modules/events/views/list-events.client.view.html'}
			}
		}).
		state('createEvent', {
			url: '/events/create',
			views: {
				'aside': {templateUrl: 'modules/core/views/todo.client.view.html'},
				'': { templateUrl: 'modules/events/views/create-event.client.view.html' }
			}
		}).
		state('viewEvent', {
			url: '/events/:eventId',
			views: {
				'aside': {templateUrl: 'modules/core/views/todo.client.view.html'},
				'': { templateUrl: 'modules/events/views/view-event.client.view.html' }
			}
		}).
		state('editEvent', {
			url: '/events/:eventId/edit',
			views: {
				'aside': {templateUrl: 'modules/core/views/todo.client.view.html'},
				'': {templateUrl: 'modules/events/views/edit-event.client.view.html'}
			}
		});
	}
]);
