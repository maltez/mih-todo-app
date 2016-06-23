'use strict';

// Task example
/*{
	'type':'task',
	'title':'Set up meetings',
	'start':'2016-06-16T10:00:00+08:00',
	'end':'2016-06-16T12:00:00+08:00',
	'className' : 'task'
}*/

class Calendar {
		constructor($scope, Days, Algorithm) {
		this.$scope = $scope;
		this.algorithm = Algorithm;

		this.days = {}; //To track remaining time for each day
		this.events = [];
		this.eventSources = [this.events];
		this.uiConfig = {
			calendar: {
				height: 700,
				editable: true,
				header: {
					left: 'today prev,next',
					center: 'title',
					right: 'agendaDay, agendaWeek, month'
				},
				businessHours : {
					start: '09:00',
					end: '18:00',
					dow: [ 1, 2, 3, 4, 5 ]
				},
				firstDay : 1,
				defaultView: 'agendaWeek',
				droppable: true,
				dropAccept: '.draggable',
				drop: function (date, jsEvent, ui) {
					$(ui.helper[0]).removeClass('draggable');
					$(ui.helper[0]).find('.label').removeClass('ng-hide');
				},
				eventReceive: function (event) {
					event.dragged = false;
				}
			}
		};

		Days.query(Calendar.getFirstAndLastWeekDay(), days => this.renderDays(days));
		this.setSlotGenerationWatcher();
	}

	setSlotGenerationWatcher() {
		var reservedSlotsIndexes = [];

		this.$scope.$watch(() => this.algorithm.daysRange, (newValue, oldValue) => {
			if (reservedSlotsIndexes.length) { //Clean previous slots
				var offsetIndex = 1;
				reservedSlotsIndexes.forEach(slotIndex => {
					this.events.splice(slotIndex - offsetIndex, 1);
					offsetIndex++;
				});
				reservedSlotsIndexes = [];
			}

			newValue.forEach(day => {
				day = new Day(day);
				reservedSlotsIndexes.push(
					this.events.push(day.createCalendarSlot(day.reservedSlot))
				);
			});
		});
	}


	renderDays(days) {
		days.forEach(day => {
			day = new Day(day);
			day.bookedSlots.forEach(slot => {
				this.events.push(day.createCalendarSlot(slot));
			});
		});
	}

	static getFirstAndLastWeekDay() {
		var curr = new Date,
			first = (curr.getDate() - curr.getDay()) + 1,
			last = first + 6;

		var firstDay = new Date(curr.setDate(first)),
			lastDay = new Date(curr.setDate(last));

		firstDay.setHours(0,0,0,0);
		lastDay.setHours(0,0,0,0);

		return {
			startDate: firstDay,
			endDate: lastDay
		}
	}
}

Calendar.$inject = ['$scope', 'Days', 'Algorithm'];
angular.module('calendar').controller('CalendarController', Calendar);
