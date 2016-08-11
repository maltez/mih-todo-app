'use strict';

angular.module('templates').config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('templates', {
		url: '/templates',
		params: {
			templateId: '',
			templateType: ''
		},
		views: {
			'aside': { templateUrl: 'modules/core/views/todo.client.view.html' },
			'': {
				/** @ngInject */
				templateUrl: $stateParams => {
					return ($stateParams.templateType === 'eventTemplates') ?
						'modules/templates/views/templates-events.client.view.html' :
						'modules/templates/views/templates-tasks.client.view.html';
				},
				controller: 'TemplatesController',
				controllerAs: 'templates'
			}
		},
		resolve: {
			/** @ngInject */
			template: ($stateParams, TemplatesService, Authentication) => {
				return TemplatesService.getById(Authentication.user, $stateParams.templateId, $stateParams.templateType);
			}
		}
	});
}]);
