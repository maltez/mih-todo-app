'use strict';

const DATE_FORMAT = 'yyyy-MM-dd';

class MigrationController {
	/** @ngInject */
	constructor(MigrateService, $cookies, $filter, Events) {
		const startDateTime = $filter('date')(new Date(), DATE_FORMAT);
		const endDateTime = $filter('date')(new Date(), DATE_FORMAT);

		Object.assign(this, {
			MigrateService,
			$cookies,
			Events,

			dateFormat: DATE_FORMAT,
			importedEvents: [],
			requestPending: false,
			outlook: {
				startDateTime,
				endDateTime
			}
		});

		this.initialize();
	}

	initialize() {
		if (this.$cookies['outlook_access_token'] && this.$cookies['outlook_email']) {
			this.outlook.token = this.$cookies['outlook_access_token'];
			this.outlook.email = this.$cookies['outlook_email'];
		} else {
			this.MigrateService.getOutlookAuthUrl().then(data => {
				this.outlook.authUrl = data.url;
			});
		}
	}

	getOutlookCalendarEvents() {
		this.importedEvents = [];

		this.MigrateService.getOutlookCalendarEvents(this.outlook).then(events => {
			this.importedEvents = this.MigrateService.convertOutlookCalendarEvents(events);
		})
	}

	importOutlookCalendarEvents() {
		new this.Events(this.importedEvents).$importEvents(response => {
			response.data.forEach(result => {
				this.importedEvents.forEach(event => {
					if (event.id == result.id) {
						event.status = result.message;
					}
				});
			})
		});
	}
}

angular.module('migrate').controller('MigrationController', MigrationController);
