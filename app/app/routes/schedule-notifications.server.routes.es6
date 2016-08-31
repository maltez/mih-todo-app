'use strict';

module.exports = function(app) {
	var notifications = require('../../app/controllers/schedule-notifications.server.controller');

	app.route('/notifications').get(notifications.list);
};
