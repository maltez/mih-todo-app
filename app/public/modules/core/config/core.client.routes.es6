'use strict';

// Setting up route

angular.module('core').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	let HOME_URL = '/todo';

	// Redirect to home view when route not found
	$urlRouterProvider.otherwise( HOME_URL );

	$stateProvider
		.state('todo_state', {
			url: HOME_URL,
			views: {
				// https://github.com/angular-ui/ui-router/wiki/nested-states-%26-nested-views
				// Note: abstract still needs a ui-view for its children to populate.
				// You can simply add it inline here.
				// template: '<ui-view/>'
				'aside': {
					templateUrl: 'modules/core/views/sidebar/todo.client.view.html'
				},
				'main-view': {
					templateUrl: 'modules/calendar/views/calendar.client.view.html'
				}
			},
			data: {
				menuLabel: "plan your day"
			}
		})
	;
}]);
