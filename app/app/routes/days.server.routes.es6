'use strict';

module.exports = function (app) {
	var days = require('../../app/controllers/days.server.controller').DaysServerController;
	var users = require('../../app/controllers/users.server.controller');


console.log(days);
	// Days Routes
	app.route('/days')
		.get(days.list)
		.post(users.requiresLogin, days.create);

	/*app.route('/days/:dayId')
		.get(days.read)
		.put(users.requiresLogin, days.hasAuthorization, days.update)
		.delete(users.requiresLogin, days.hasAuthorization, days.remove);*/
};
