'use strict';

module.exports = function(app) {
	var emailNotificationCtrl = require('../../app/controllers/notifications-by-email.server.controller');

	app.route('/email-overdue-tasks')
		.get(emailNotificationCtrl.emailOverdueTasks);
};
