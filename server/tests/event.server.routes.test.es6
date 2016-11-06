'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Event = mongoose.model('Activity'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, event;

/**
 * Event routes tests
 */
describe('Event CRUD tests', function () {

	before(function (done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function (done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'M3@n.jsI$Aw3$0m3'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Event
		user.save(function () {
			event = {
				title: 'Event title',
				type : 'event'
			};
			done();
		});
	});

	it('should be able to save a Event if logged in', function (done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function (signinErr, signinRes) {
				// Handle signin error
				if (signinErr) {
					return done(signinErr);
				}

				// Get the userId
				var userId = user.id;

				// Save a new Event
				agent.post('/events')
					.send(event)
					.expect(200)
					.end(function (eventSaveErr, eventSaveRes) {
						// Handle Event save error
						if (eventSaveErr) {
							return done(eventSaveErr);
						}

						// Get a list of Events
						agent.get('/events')
							.end(function (eventsGetErr, eventsGetRes) {
								// Handle Event save error
								if (eventsGetErr) {
									return done(eventsGetErr);
								}

								// Get Events list
								var events = eventsGetRes.body;

								// Set assertions
								(events[0].user._id).should.equal(userId);
								(events[0].name).should.match('Event name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an Event if not logged in', function (done) {
		agent.post('/events')
			.send(event)
			.expect(403)
			.end(function (eventSaveErr, eventSaveRes) {
				// Call the assertion callback
				done(eventSaveErr);
			});
	});

	it('should not be able to save an Event if no title is provided', function (done) {
		// Invalidate name field
		event.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function (signinErr, signinRes) {
				// Handle signin error
				if (signinErr) {
					return done(signinErr);
				}

				// Get the userId
				var userId = user.id;

				// Save a new Event
				agent.post('/events')
					.send(event)
					.expect(400)
					.end(function (eventSaveErr, eventSaveRes) {
						// Set message assertion
						(eventSaveRes.body.message).should.match('Please fill the Title');

						// Handle Event save error
						done(eventSaveErr);
					});
			});
	});

	it('should be able to update an Event if signed in', function (done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function (signinErr, signinRes) {
				// Handle signin error
				if (signinErr) {
					return done(signinErr);
				}

				// Get the userId
				var userId = user.id;

				// Save a new Event
				agent.post('/events')
					.send(event)
					.expect(200)
					.end(function (eventSaveErr, eventSaveRes) {
						// Handle Event save error
						if (eventSaveErr) {
							return done(eventSaveErr);
						}

						// Update Event name
						event.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing Event
						agent.put('/events/' + eventSaveRes.body._id)
							.send(event)
							.expect(200)
							.end(function (eventUpdateErr, eventUpdateRes) {
								// Handle Event update error
								if (eventUpdateErr) {
									return done(eventUpdateErr);
								}

								// Set assertions
								(eventUpdateRes.body._id).should.equal(eventSaveRes.body._id);
								(eventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to delete an Event if signed in', function (done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function (signinErr, signinRes) {
				// Handle signin error
				if (signinErr) {
					return done(signinErr);
				}

				// Get the userId
				var userId = user.id;

				// Save a new Event
				agent.post('/events')
					.send(event)
					.expect(200)
					.end(function (eventSaveErr, eventSaveRes) {
						// Handle Event save error
						if (eventSaveErr) {
							return done(eventSaveErr);
						}

						// Delete an existing Event
						agent.delete('/events/' + eventSaveRes.body._id)
							.send(event)
							.expect(200)
							.end(function (eventDeleteErr, eventDeleteRes) {
								// Handle event error error
								if (eventDeleteErr) {
									return done(eventDeleteErr);
								}

								// Set assertions
								(eventDeleteRes.body._id).should.equal(eventSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});
	afterEach(function (done) {
		User.remove().exec(function () {
			Event.remove().exec(done);
		});
	});
});
