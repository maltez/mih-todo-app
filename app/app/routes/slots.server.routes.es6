'use strict';

module.exports = function (app) {
	var slots = require('../../app/controllers/slots.server.controller').SlotsServerController;
	var users = require('../../app/controllers/users.server.controller');

	// Days Routes
	app.route('/slots')
		.get(slots.list)
		.post(users.requiresLogin, slots.create);

	app.route('/slots/:slotId')
		.get(slots.read)
		.put(users.requiresLogin, slots.update)
		.delete(users.requiresLogin, slots.remove);

	app.param('slotId', slots.slotByID);
};
