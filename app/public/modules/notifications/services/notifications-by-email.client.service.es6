'use strict';

//NotificationsByEmail service used to notify about overdue events
angular.module('notifications').factory('NotificationsByEmail', ['$resource',
	function($resource) {
		const MINUTE_AS_MSECS = 60 * 1000;
		const HOUR_AS_MSECS = 60 * MINUTE_AS_MSECS;

		const _$resourceOverdueTasks = $resource(
			'email-overdue-tasks/',
			{
				/*defaults*/
			},
			{
				notifyAllByEmail: {
					method: 'GET',
					isArray: true	// avoid angular error in console - 'expected object'
				}
			}
		);

		let _intervalInstance = null;

		return {
			emailIntervalFn: function emailIntervalFn() {
				_$resourceOverdueTasks.notifyAllByEmail({time: new Date()});
			},
			options: {
				defaultOverdueEmailFrequencyHours: 24,
				emailRecurrencyMsecs: null
			},
			init: function (config) {
				config = (typeof config === 'object') ? config : {};

				this.intervalSetup(config.emailRecurrencyHours);
			},
			intervalSetup: function (emailRecurrencyHours) {
				if (emailRecurrencyHours === 0 /*hours*/) {
					// TODO: clarify condition for disabled emails (future feature)
					this.options.emailRecurrencyMsecs = null;
					return;
				}

				this.options.emailRecurrencyMsecs =
					(emailRecurrencyHours || this.options.defaultOverdueEmailFrequencyHours) * HOUR_AS_MSECS;

				// TODO: remove after demo!!!
				this.options.emailRecurrencyMsecs = 5 /*s*/ * 1000;
				// TODO: remove after demo!!!

				_intervalInstance && this.destroy();
				_intervalInstance = setInterval(this.emailIntervalFn.bind(this), this.options.emailRecurrencyMsecs);

			},
			destroy: function () {
				clearInterval(_intervalInstance);
				_intervalInstance = null;
			}
		};
	}
]);
