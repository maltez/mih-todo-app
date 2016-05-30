'use strict';
class TimeSlot {
	constructor(duration) {
		this.duration = duration;
	}
}

class Day {
	constructor(date, freeTime, bookedSlots) {
		this.date = new Date(date);
		this.freeTime = freeTime;
		this.bookedSlots = bookedSlots || [];

		this.date.setHours(0,0,0,0); //Day in database shouldn't have special time, for search methods
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

	static timeToMinutes(time) {
		return time.split(':').reduce((prev, cur) => (parseInt(prev, 10)) + parseInt(cur, 10));
	};
}

class Algorithm {
	constructor(Days, Authentication) {
		this.daysMap = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu',  5: 'fri', 6: 'sat' };
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
				resolve(this.getSuitableSlots(priority, estimation));
			});
		});
	}

	fillEmptyDaysRange(from, to, days) {
		var daysRange = {},
			startDate = new Date(from),
			userSettings = this.user.predefinedSettings;

		days.forEach(day => daysRange[new Date(day.date)] = new Day(day.date, day.freeTime, day.bookedSlots));

		while(startDate <= to) {
			if (!daysRange[startDate]) {
				let daySettings = userSettings.workingHours[this.daysMap[startDate.getDay()]];

				if (daySettings.isWorkingDay) {
					var freeTime = Day.timeToMinutes(daySettings.end) - Day.timeToMinutes(daySettings.start);

					daysRange[startDate] = new Day(new Date(startDate), freeTime);
				}
			}

			startDate = new Date(startDate.setDate(startDate.getDate() + 1));
		}

		this.daysRange = daysRange;
	}

	getSuitableSlots(priority, estimation) {
		var suitableDays = [];

		switch (priority) {
			//Fill empty slots as quick as possible
			case '1':
			case '3':
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
			case '2':
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

		return suitableDays;
	}
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
