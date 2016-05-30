'use strict';

class TemplatesController {
	constructor(Authentication, Users, Notification) {
		this.Users = Users;
		this.Authentication = Authentication;
		this.user = Authentication.user;
		this.notification = Notification;
		this.list = this.user.templates;

		this.sliderOptions = {
			floor: 0,
			ceil: 24
		};
	}

	update(template, index) {
		this.user.templates[index] = template;

		var updatedUser = new this.Users(this.user);

		updatedUser.$update(updatedUser => {
			this.notification.success(`"Template ${template.title}" was successfully updated`);
			this.user = this.Authentication.user = updatedUser;
		}, err => console.error(err));
	}

	remove(template, index) {
		var updatedUser = new this.Users(this.user);

		updatedUser.templates.splice(index, 1);

		updatedUser.$update(updatedUser => {
			this.notification.success(`"Template ${template.title}" was successfully removed`);
			this.user = this.Authentication.user = updatedUser;
			this.list = updatedUser.templates;
		}, err => console.error(err));
	}
}

TemplatesController.$inject = ['Authentication', 'Users', 'Notification'];
angular.module('tasks').controller('TemplatesController', TemplatesController);
