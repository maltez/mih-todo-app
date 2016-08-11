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

	viewTemplates() {
		const lastUsedTemplate = this.TemplatesService.getLastUsed(this.Authentication.user);

		this.$state.go('templates', {
			templateId: lastUsedTemplate.data._id,
			templateType: lastUsedTemplate.type
		});
	}
}

angular.module('core').controller('HeaderController', HeaderController);
