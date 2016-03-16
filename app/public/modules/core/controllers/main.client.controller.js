'use strict';

angular.module('core').controller('MainController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		this.withSidebar = false;

		$scope.$on('toggleSidebar', () => {
			this.withSidebar = !this.withSidebar;
		});
	}
]);
