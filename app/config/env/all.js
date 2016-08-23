'use strict';

module.exports = {
	app: {
		title: 'Make It Happen',
		description: 'Application for self organization',
		keywords: 'Make It Happen'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'MEAN',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'public/inspinia/font-awesome/css/font-awesome.css',
				'public/inspinia/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
				'public/lib/angularjs-slider/dist/rzslider.min.css',
				'public/lib/fullcalendar/dist/fullcalendar.css',
				'public/lib/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/lodash/lodash.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/bootstrap/dist/js/bootstrap.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
				'public/lib/angular-file-upload/dist/angular-file-upload.js',
				'public/lib/angularjs-slider/dist/rzslider.js',
				'public/lib/modelOptions/ngModelOptions.js',
				'public/lib/angular-strap/dist/angular-strap.min.js',
				'public/lib/angular-strap/dist/angular-strap.tpl.min.js',
				'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
				'public/lib/moment/min/moment-with-locales.min.js',
				'public/lib/angular-ui-calendar/src/calendar.js',
				'public/lib/fullcalendar/dist/fullcalendar.js',
				'public/lib/fullcalendar/dist/gcal.js',
				'public/lib/raphael/raphael.min.js',
				'public/lib/morris.js/morris.min.js',
				'public/lib/angular-morris-chart/src/angular-morris-chart.min.js',
				'public/lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'
			]
		},
		css: [
			'public/inspinia/css/*.css',
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/inspinia/js/directives.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	},
	profilesFolder: './modules/users/img/profiles/',
	uploads: {
		profileUpload: {
			dest: './public/modules/users/img/profiles/', // Profile upload destination path
			limits: {
				fileSize: 3 * 1024 * 1024 // Max file size in bytes (3 MB)
			}
		}
	}
};
