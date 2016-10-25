'use strict';

module.exports = function(app) {
	var notifications = require('./controllers/schedule-notifications.server.controller');

	app.route('/notifications').get(notifications.list);
};
