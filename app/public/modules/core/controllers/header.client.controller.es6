'use strict';

class HeaderController {
	/** @ngInject */
	constructor($scope, Authentication, $state, TemplatesService) {
		Object.assign(this, {$scope, Authentication, $state, TemplatesService});

		this.user = {
			username: this.Authentication.user.username
		};

		$scope.$on('updateUserInfo', function (event, user) {
			angular.copy(user, this.user);
		});
	}

	toggleSidebar () {
		this.$scope.$emit('toggleSidebar');
	}
}

angular.module('core').controller('HeaderController', HeaderController);
