'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', function ($scope, Authentication, Menus) {
	$scope.authentication = Authentication;

	$scope.toggleSidebar = function () {
		$scope.$emit('toggleSidebar');
	};
}]);
