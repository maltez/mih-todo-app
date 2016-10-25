class templatesTasksListController {
	/** @ngInject */
	constructor(Authentication, $state) {
		this.templatesList = Authentication.user.taskTemplates;
		this.$state = $state;
		this.sortReverse = true;
	}

	viewTemplate(templateId) {
		this.$state.go('templates', {
			templateId: templateId,
			templateType: 'taskTemplates'
		})
	}
}

angular.module('tasks').controller('templatesTasksListController', templatesTasksListController);
