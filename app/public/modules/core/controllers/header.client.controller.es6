'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function ($scope, Authentication, Menus) {
		var vm = this;
		
		vm.authentication = Authentication;

		vm.toggleSidebar = () => {
			$scope.$emit('toggleSidebar');
		};
	}
]);
