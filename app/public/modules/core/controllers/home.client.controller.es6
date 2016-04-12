'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', function ($scope, Authentication, $location) {
	var _this = this;

	// If user is not signed in then redirect back home
	if (!Authentication.user) $location.path('/signin');

	this.withSidebar = false;

	$scope.$on('toggleSidebar', function () {
		_this.withSidebar = !_this.withSidebar;
	});
}]);
