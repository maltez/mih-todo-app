'use strict';

class TemplatesController {
	/** @ngInject */
	constructor(template, Authentication, Users, Notification, $state, TemplatesService) {
		Object.assign(this, {Users, Authentication, Notification, $state, TemplatesService});

		this.user = Authentication.user;
		this.list = template._id ? [template] : [];

		this.sliderOptions = {
			floor: 0,
			ceil: template.estimation * 2
		};
	}

	update(template) {
		var updatedUser = new this.Users(this.user);

		updatedUser.$update(updatedUser => {
			this.Notification.success(`"Template ${template.title}" was successfully updated`);
			this.user = this.Authentication.user = updatedUser;
		}, err => console.error(err));
	}

	remove(templateToRemove, templateType) {
		var updatedUser = new this.Users(this.user);

		updatedUser[templateType] = updatedUser[templateType].filter(template => template._id !== templateToRemove._id);

		updatedUser.$update(updatedUser => {
			this.Notification.success(`"Template ${templateToRemove.title}" was successfully removed`);
			this.user = this.Authentication.user = updatedUser;

			const lastUsedTemplate = this.TemplatesService.getLastUsed(templateType, updatedUser);

			this.$state.go('templates', {
				templateId: lastUsedTemplate._id,
				templateType: templateType
			});
		}, err => console.error(err));
	}
}

angular.module('tasks').controller('TemplatesController', TemplatesController);
