'use strict';

angular.module('calendar')
.controller('CalendarController',
	function ($scope) {

		/* Mocked Events and tasks */
		$scope.events = [
			{
				'id':'1',
				'type':'event',
				'title':'JS Meetup',
				'start':'2016-05-03T10:00:00+08:00',
				'end':'2016-05-03T11:00:00+08:00',
				'className':'event',
				'allDay':false
			},
			{
				'id':'2',
				'type':'event',
				'title':'Weekly catch-up',
				'start':'2016-05-10T09:00:00+08:00',
				'end':'2016-05-10T10:00:00+08:00',
				'className':'event',
				'allDay':false,
				dow : [5]
			},
			{
				'id':'3',
				'type':'event',
				'title':'One to one with John',
				'start':'2016-05-09T14:00:00+08:00',
				'end':'2016-05-09T15:00:00+08:00',
				'className':'event',
				'allDay':false
			},
			{
				'id':'4',
				'type':'event',
				'title':'Sick leave',
				'start':'2016-05-11T9:00:00+08:00',
				'end':'2016-05-11T18:00:00+08:00',
				'className':'event',
				'allDay':true
			},
			{
				start: '2016-05-11T00:00:00',
				end: '2016-05-11T23:59:59',
				rendering: 'background'
			},
			{
				'id':'5',
				'type':'task',
				'title':'Set up meetings',
				'start':'2016-05-12T10:00:00+08:00',
				'end':'2016-05-12T12:00:00+08:00',
				'className' : 'task',
				'allDay':false
			}
		];

		$scope.eventSources = [$scope.events];

		$scope.uiConfig = {
			calendar: {
				height: 700,
				editable: true,
				header: {
					left: 'today prev,next',
					center: 'title',
					right: 'agendaDay, agendaWeek, month'
				},
				businessHours : {
					start: '10:00',
					end: '18:00',
					dow: [ 1, 2, 3, 4, 5 ]
				},
				firstDay : 1,
				defaultView: 'month',
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
	});
