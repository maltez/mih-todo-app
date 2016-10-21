class templatesEventsListController {
	/** @ngInject */
	constructor(Authentication, $state) {
		this.templatesList = Authentication.user.eventTemplates;
		this.$state = $state;
		this.sortReverse = true;
	}

	viewTemplate(templateId) {
		this.$state.go('templates', {
			templateId: templateId,
			templateType: 'eventTemplates'
		})
	}
}

angular.module('events').controller('templatesEventsListController', templatesEventsListController);
