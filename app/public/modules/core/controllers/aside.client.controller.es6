'use strict';

angular.module('core').controller('AsideController', 
	['$scope', '$location', 'Authentication', '$stateParams',
	function ($scope, $location, Authentication, $stateParams) {
		$scope.templatesList = Authentication.user;
		$scope.categories = ['todo', 'templates', 'overdue'];
		$scope.currentCategory = $stateParams.category || $scope.categories[0];

		$scope.updateView = () => {
			switch ($scope.currentCategory) {
				case 'templates':
					$location.path('templates');
					break;
				case 'overdue':
					$location.path('/notifications');
					break;
				default:
					$location.path('/');
					break;
			}
		};
	}]);
