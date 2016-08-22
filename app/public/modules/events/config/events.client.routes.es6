'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function ($stateProvider) {
		// Events state routing
		$stateProvider
			.state('todo_state.events', {
				url: '/events',
				abstract: true
			})
			.state('todo_state.events.create', {
				url: '/create?eventPresetType',
				params: {
					eventPresetType: undefined
				},
				views: {
					'main-view@': {
						templateUrl: 'modules/events/views/create-event.client.view.html'
					}
				}
			})
			.state('todo_state.events.edit', {
				url: '/:eventId/edit',
				views: {
					'main-view@': {
						templateUrl: 'modules/events/views/edit-event.client.view.html'
					}
				}
			})
		;
	}
]);
