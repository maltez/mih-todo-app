'use strict';

//http://fullcalendar.io/docs/

class Calendar {
	constructor(Slots, ScheduleNotifications, uiCalendarConfig, $rootScope, Authentication) {
		this.config = uiCalendarConfig;
		this.Slots = Slots;
		this.Notifications = ScheduleNotifications;
		this.$rootScope = $rootScope;
		this.user = Authentication.user;

		this.bookedSlots = [];
		this.eventSources = [{
			url: '/slots' //Fetch data from server
		}];
		let hours = _.chain(this.user.predefinedSettings.workingHours).toArray();

		this.uiConfig = {
			calendar: {
				height: 700,
				editable: true,
				header: {
					left: 'today prev,next',
					center: 'title',
					right: 'agendaDay, agendaWeek, month'
				},
				scrollTime: hours.map( day => day.start ).min().value(),
				businessHours: false,
				firstDay: 1,
				defaultView: 'agendaWeek',
				timezone: 'local',
				eventDrop: (event, delta, revertFunc) => this.eventDropHandler(event, delta, revertFunc)
			}
		};

		//Listen for new task form slot generation
		this.$rootScope.$on('NEW_SLOTS_GENERATED', (e, slots) => this.renderBookedSlots(slots));
		this.setBusinessHours()
	}

	generateBgSlot(start, end, dayIndex) {
		if (dayIndex === 7) dayIndex = 0; //For sunday

		return {
			start: start,
			end: end,
			color: '#e8f2f9',
			rendering: 'background',
			dow: [dayIndex]
		}
	}

	setBusinessHours() {
		var nonWorkingHours = [];

		Object.keys(this.user.predefinedSettings.workingHours).forEach(key => {
			let day = this.user.predefinedSettings.workingHours[key];

			if (day.isWorkingDay) {
				nonWorkingHours.push(
					this.generateBgSlot('00:00', day.start, day.dayIndex),
					this.generateBgSlot(day.end, '24:00', day.dayIndex)
				);
			} else {
				nonWorkingHours.push(
					this.generateBgSlot('00:00', '24:00', day.dayIndex)
				);
			}
		});

		this.eventSources.push(nonWorkingHours);
	}

	eventDropHandler(event, delta, revertFunc) {
		if (event.taskId) { //Update slot in database
			new this.Slots(event).$update(response => {

			}, err => revertFunc)
		} else { //Update slot on new task form
			this.$rootScope.$broadcast('NEW_SLOTS_CHANGED',
				this.config.calendars.main.fullCalendar( 'clientEvents', event => {
					//return only slots from the original array
					if(event.source.origArray == this.bookedSlots) return event;
				})
			);
		}
	}

	renderBookedSlots(slots) {
		this.config.calendars.main.fullCalendar( 'removeEventSource', this.bookedSlots );
		this.config.calendars.main.fullCalendar( 'addEventSource', slots );
		this.bookedSlots = slots;
	}
}

Calendar.$inject = ['Slots', 'ScheduleNotifications', 'uiCalendarConfig', '$rootScope', 'Authentication'];
angular.module('calendar').controller('CalendarController', Calendar);
