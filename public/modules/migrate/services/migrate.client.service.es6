class MigrateService {
	/** @ngInject */
	constructor($http) {
		Object.assign(this, {
			$http
		});
	}

	getOutlookAuthUrl() {
		return this.$http.get('/migrate/outlook/get-auth-url').then(responce => responce.data);
	}

	getOutlookCalendarEvents(params) {
		return this.$http.get('/migrate/outlook/get-calendar-events', {params}).then(responce => responce.data);
	}

	convertOutlookCalendarEvents(events) {
		return events.map(event => {
			return {
				id: event.Id,
				type: 'event',
				title: event.Subject,
				notes: event.BodyPreview,
				days: {
					startTime: event.Start.DateTime,
					endTime: event.End.DateTime
				}
			}
		});
	}
}

angular.module('migrate').service('MigrateService', MigrateService);
