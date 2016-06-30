'use strict';

class TimeSlot {
	constructor(duration) {
		this.duration = duration;
	}
}

class Day {
	static get daysMap() {
		return { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu',  5: 'fri', 6: 'sat' };
	};

	constructor(data) {
		Object.assign(this, data);
		this.date = new Date(this.date);
		this.settings = window.user.predefinedSettings.workingHours[Day.daysMap[this.date.getDay()]];
		this.date.setHours(0,0,0,0); //Day in database shouldn't have special time, for search methods

		if (!this.freeTime)	this.freeTime = (Algorithm.timeToMinutes(this.settings.end) - Algorithm.timeToMinutes(this.settings.start)) / 60;
		if (!this.bookedSlots) this.bookedSlots = [];
		if (!this.freeTimeStart) {
			this.freeTimeStart = new Date(this.date);
			this.freeTimeStart.setMinutes(Algorithm.timeToMinutes(this.settings.start));
		}
	}

	reserveSlot(duration) {
		this.freeTime -= duration;
		this.reservedSlot = new TimeSlot(duration);
	}

	bookSlot(taskId) {
		this.reservedSlot.taskId = taskId;
		this.bookedSlots.push(this.reservedSlot);
		delete this.reservedSlot;
	}

	createCalendarSlot(slot) {
		var freeTimeStart = new Date(this.freeTimeStart),
			freeTimeEnd = new Date(freeTimeStart);

		freeTimeEnd.setMinutes(freeTimeEnd.getMinutes() + slot.duration * 60);
		this.freeTimeStart = freeTimeEnd;

		return {
			type: slot.type || 'task',
			title: slot.title || 'temp',
			start: freeTimeStart,
			end: freeTimeEnd,
			className: slot.type || 'task'
		};
	}
}

class Algorithm {
	constructor(Days, Authentication) {
		this.Days = Days;
		this.user = Authentication.user;
		this.daysRange = [];
	}

	generateSlots(startDate, endDate, priority, estimation) {
		startDate.setHours(0,0,0,0);
		endDate.setHours(0,0,0,0);

		return new Promise(resolve => {
			this.Days.query({startDate: startDate, endDate: endDate}, days => {
				this.fillEmptyDaysRange(startDate, endDate, days);
				this.getSuitableSlots(priority, estimation);
				resolve(this.daysRange);
			});
		});
	}

	fillEmptyDaysRange(from, to, days) {
		var daysRange = {},
			startDate = new Date(from),
			userSettings = this.user.predefinedSettings;

		days.forEach(day => {
			daysRange[new Date(day.date)] = new Day(day);
			daysRange[new Date(day.date)]._id = day._id;
		});

		while(startDate <= to) {
			if (!daysRange[startDate]) {
				let day = new Day({
					date: new Date(startDate)
				});

				if (day.settings.isWorkingDay) {
					daysRange[startDate] = day;
				}
			}

			startDate = new Date(startDate.setDate(startDate.getDate() + 1));
		}

		this.daysRange = daysRange;
	}

	getSuitableSlots(priority, estimation) {
		var suitableDays = [];

		priority = parseInt(priority, 10);

		switch (priority) {
			//Fill empty slots as quick as possible
			case 1:
			case 3:
				Object.keys(this.daysRange).forEach(dayId => {
					let day = this.daysRange[dayId];

					if (day.freeTime && estimation) {
						let slotDuration = (day.freeTime > estimation) ? estimation : day.freeTime;

						day.reserveSlot(slotDuration);
						estimation -= slotDuration;
						suitableDays.push(day);
					}
				});

				break;

			//Fill empty slots balanced
			case 2:
				var optimalSlotDuration = (estimation /  Object.keys(this.daysRange).length );

				optimalSlotDuration =(optimalSlotDuration < 2) ? 2 :  Math.ceil(optimalSlotDuration);

				Object.keys(this.daysRange).forEach(dayId => {
					let day = this.daysRange[dayId];

					if (day.freeTime && estimation) {
						if (estimation < optimalSlotDuration) optimalSlotDuration = estimation;

						let slotDuration = (day.freeTime > optimalSlotDuration) ? optimalSlotDuration : day.freeTime;

						day.reserveSlot(slotDuration);
						estimation -= slotDuration;
						suitableDays.push(day);
					}
				});

				break;
		}

		this.daysRange = suitableDays;
	}

	static timeToMinutes(time) {
		return time.split(':').reduce((prev, cur) => ((parseInt(prev, 10)) * 60) + parseInt(cur, 10));
	};

	static minutesToTime(minutes) {
		return [
			('0' + Math.floor(minutes / 60)).substr(-2),
			('0' + minutes % 60).substr(-2)
		].join(':');
	};
}

/*class TimeSlot {
	constructor(start, end) {
		this.start = start;
		this.end = end;
		this.startInMinutes = TimeSlot.timeToMinutes(start);
		this.endInMinutes = TimeSlot.timeToMinutes(end);
		this.duration = this.endInMinutes - this.startInMinutes;
	}

	static timeToMinutes(time) {
		return time.split(':').reduce((prev, cur) => (parseInt(prev, 10) * 60) + parseInt(cur, 10));
	};

	static minutesToTime(minutes) {
		return [
			('0' + Math.floor(minutes / 60)).substr(-2),
			('0' + minutes % 60).substr(-2)
		].join(':');
	};
}

class Day {
	constructor(date, settings, booked) {
		this.date = date;
		this.bookedTime = [];
		this.temporaryBookedTime = [];

		this.freeTime = [new TimeSlot(settings.start, settings.end)];

		//booked.length && booked.forEach(time => this.fillFreeTime(time));
	}

	bookTimeSlot(index, start, end) {
		var slot = this.freeTime[index];

		if (slot.start == start && slot.end == end) { //No time left in slot
			delete this.freeTime[index];
		} else if (slot.start > start && slot.end > end) { //There are free time in both start and end of slot
			this.freeTime[index] = new TimeSlot(slot.start, start);
			this.freeTime.splice(index, 0, new TimeSlot(end, slot.end));
		} else if(slot.start > start) { //There is free time left in the start of slot
			this.freeTime[index] = new TimeSlot(slot.start, start);
		} else if (slot.end > end) { //There is free time left in the end of slot
			this.freeTime[index] = new TimeSlot(end, slot.end);
		}

		this.temporaryBookedTime.push(new TimeSlot(start, end));
	}
}

class Algorithm {
	constructor(Days, Authentication) {
		this.daysMap = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu',  5: 'fri', 6: 'sat' };
		this.Days = Days;
		this.user = Authentication.user;
		this.daysRange = [];
	}

	generateSlots(startDate, endDate, priority, estimation) {
		return new Promise(resolve => {
			this.Days.query({startDate: startDate, endDate: endDate}, days => {
				this.daysRange = this.fillEmptyDaysRange(startDate, endDate, days);
				resolve(this.getSuitableSlots(priority, estimation));
			});
		});
	}

	fillEmptyDaysRange(startDate, endDate, days) {
		var daysRange = {},
			rangeDayDate = new Date(startDate),
			userSettings = this.user.predefinedSettings;

		while(rangeDayDate <= endDate) {
			let daySettings = userSettings.workingHours[this.daysMap[rangeDayDate.getDay()]];

			if (daySettings.isWorkingDay) {
				daysRange[rangeDayDate] = new Day(new Date(rangeDayDate), daySettings, userSettings.booked);
			}

			rangeDayDate = new Date(rangeDayDate.setDate(rangeDayDate.getDate() + 1));
		}

		//days.forEach(day => daysRange[day.date] = day );

		return daysRange;
	}

	getSuitableSlots(priority, estimation) {
		estimation = estimation * 60; //In minutes

		switch (priority) {
			//Fill empty slots as quick as possible
			case '1':
			case '3':
				Object.keys(this.daysRange).forEach((dayId) => {
					if (!estimation) return;

					this.daysRange[dayId].freeTime.forEach((slot, index) => {
						if (!estimation) return;

						var	slotEnd;

						if (slot.duration > estimation) { //Last slot to booking
							slotEnd = TimeSlot.minutesToTime(slot.startInMinutes + estimation);
							estimation = 0;
						} else {
							slotEnd = slot.end;
							estimation -= slot.duration;
						}

						this.daysRange[dayId].bookTimeSlot(index, slot.start, slotEnd);
					});
				});
				break;

			case '2':
			case '4':
				//Fill empty slots as balanced as possible
				break;
		}

		return this.daysRange;
	}
}*/

Algorithm.$inject = ['Days', 'Authentication'];
angular.module('days').service('Algorithm', Algorithm);
