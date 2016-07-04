'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	agent = request.agent(app);

var user, credentials;

describe('Algorithm routes tests', () => {
	beforeEach(done => {
		credentials = {
			email: 'test@test.com',
			password: 'password'
		};

		user = new User({
			email: credentials.email,
			username: 'User name',
			password: credentials.password,
			provider: 'local'
		});

		user.save(() => {
			done();
		});
	});

	it('should return free time for request time range', done => {
		var start = new Date(),
			end = new Date();

		end.setDate(end.getDate() + 3);

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(signInErr => {
				if (signInErr) done(signInErr);

				agent
					.get(`/algorithm/free-time?start=${start}&end=${end}`)
					.expect(200)
					.end((taskSaveErr, taskSaveRes) => {
						if (taskSaveErr) done(signInErr);

						var daysDate = Object.keys(taskSaveRes.body);

						(daysDate.length).should.equal(4);
						should.exist(taskSaveRes.body[daysDate[0]][0].start);
						should.exist(taskSaveRes.body[daysDate[0]][0].end);

						done();
					});
			});
	});
});
