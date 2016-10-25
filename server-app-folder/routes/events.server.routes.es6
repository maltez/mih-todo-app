'use strict';

module.exports = function(app) {
	var users = require('../controllers/users.server.controller');
	var events = require('../controllers/events.server.controller');

	// Events Routes
	app.route('/events')
		.get(events.list)
		.post(users.requiresLogin, events.create);

	app.route('/events/:eventId')
		.get(events.read)
		.put(users.requiresLogin, events.hasAuthorization, events.update)
		.delete(users.requiresLogin, events.hasAuthorization, events.delete);

	app.route('/events-slots')
		.get(events.getSlotsByEvent)
		.delete(events.deleteSlotsByEvent);

	// Finish by binding the Event middleware
	app.param('eventId', events.eventByID);
};
