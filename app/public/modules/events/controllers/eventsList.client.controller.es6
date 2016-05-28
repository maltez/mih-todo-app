'use strict';

// Events controller
angular.module('events').controller('EventsListController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Events',
	function($scope, $rootScope, $stateParams, $location, Authentication, Events) {
		$scope.authentication = Authentication;

		$rootScope.$on('NEW_EVENTS_MODIFY', function () {
			$scope.find();
		});

		// Find a list of Events
		$scope.find = function() {
			$scope.events = Events.query();
		};

	}
]);
