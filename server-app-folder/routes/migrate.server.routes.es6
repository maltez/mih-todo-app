'use strict';

module.exports = function (app) {
	var outlook = require('../controllers/migrate/outlook.server.controller');

	app.route('/migrate/outlook/get-auth-url').get(outlook.getAuthUrl);
	app.route('/migrate/outlook/authorize').get(outlook.getTokenFromCode);
	app.route('/migrate/outlook/get-calendar-events').get(outlook.getCalendarEvents);
};
