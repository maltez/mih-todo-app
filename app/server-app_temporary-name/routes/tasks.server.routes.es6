'use strict';

module.exports = function(app) {
	var users = require('./controllers/users.server.controller');
	var tasks = require('./controllers/tasks.server.controller');

	// Tasks Routes
	app.route('/tasks')
		.get(tasks.list)
		.post(users.requiresLogin, tasks.create);

	app.route('/tasks/:taskId')
		.get(tasks.read)
		.put(users.requiresLogin, tasks.hasAuthorization, tasks.update)
		.delete(users.requiresLogin, tasks.hasAuthorization, tasks.delete);

	app.route('/tasks-slots')
		.get(tasks.getSlotsByTask)
		.delete(tasks.deleteSlotsByTask);
	
	// Finish by binding the Task middleware
	app.param('taskId', tasks.taskByID);
};
