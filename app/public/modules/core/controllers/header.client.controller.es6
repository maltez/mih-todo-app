'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function ($scope, Authentication, Menus) {
		var vm = this;
		
		vm.authentication = Authentication;
		vm.user = {
			username: vm.authentication.user.username
		};

		vm.toggleSidebar = () => {
			$scope.$emit('toggleSidebar');
		};

		$scope.$on('updateUserInfo', function (event, user) {
			angular.copy(user, vm.user);
		});
	}
]);
