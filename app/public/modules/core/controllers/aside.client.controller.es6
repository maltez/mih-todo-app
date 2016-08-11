'use strict';

angular.module('core').controller('AsideController', ['$scope', '$location', 'AsideService', 'Authentication',
	function ($scope, $location, AsideService, Authentication) {
		$scope.templatesList = Authentication.user;

		$scope.categories = ['todo', 'templates', 'overdue'];

		$scope.currentCategory = AsideService.getCurrentCategory() || $scope.categories[0];

		$scope.$on('setAsideCategory', function (event, selection) {
			AsideService.setCurrentCategory(selection);
			$scope.currentCategory = AsideService.getCurrentCategory() || $scope.categories[0];
		});

		$scope.updateView = () => {
			switch ($scope.currentCategory) {
				case 'templates':
					$location.path('templates');
					AsideService.setCurrentCategory($scope.categories[1]);
					break;
				case 'overdue':
					$location.path('/notifications');
					AsideService.setCurrentCategory($scope.categories[2]);
					break;
				default:
					$location.path('/');
					AsideService.setCurrentCategory($scope.categories[0]);
					break;
			}
		};
	}]);
