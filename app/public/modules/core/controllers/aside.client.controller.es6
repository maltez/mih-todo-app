'use strict';

angular.module('core').controller('AsideController', ['$scope', '$location', 'AsideService',
	function ($scope, $location, AsideService) {

		$scope.categories = ['todo', 'templates', 'notifications'];

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
				case 'notifications':
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
