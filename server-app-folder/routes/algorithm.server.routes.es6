'use strict';

module.exports = function (app) {
	// Root routing
	var algorithm = require('./controllers/algorithm.server.controller').AlgorithmServerController;

	app.route('/algorithm/free-time').get(algorithm.getFreeTime);
};
