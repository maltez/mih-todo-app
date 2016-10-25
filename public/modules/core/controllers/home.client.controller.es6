'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', '$timeout', function ($scope, Authentication, $location, $timeout) {
	var _this = this;

	// If user is not signed in then redirect back home
	if (!Authentication.user) $location.path('/signin');

	this.withSidebar = true;

	$scope.$on('toggleSidebar', function () {
		_this.withSidebar = !_this.withSidebar;

		reRenderDashboardElements();
	});


	var reRenderDashboardElements = () => {
		// refresh estimation slider
		$timeout(function() {
			$scope.$broadcast('rzSliderForceRender');
		}, 600);
	}
}]);
