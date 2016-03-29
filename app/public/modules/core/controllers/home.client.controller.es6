'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
	function($scope, Authentication, $location) {
		// If user is not signed in then redirect back home
		if (!Authentication.user) $location.path('/signin');

		this.withSidebar = false;

		$scope.$on('toggleSidebar', () => {
			this.withSidebar = !this.withSidebar;
		});
	}
]);
