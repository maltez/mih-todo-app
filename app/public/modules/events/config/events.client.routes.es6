'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('createEvent', {
			url: '/events/create',
			templateUrl: 'modules/events/views/create-event.client.view.html'
		}).
		state('editEvent', {
			url: '/events/:eventId/edit',
			templateUrl: 'modules/events/views/edit-event.client.view.html'
		});
	}
]);
