'use strict';

angular.module('core').controller('HeaderController', HeaderController);

HeaderController.$inject = ['$scope', 'Authentication'];

function HeaderController ($scope, Authentication) {
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
