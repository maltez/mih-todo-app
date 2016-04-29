'use strict';

angular.module('calendar')
.controller('CalendarController',
	function ($scope) {

	/* Mocked Events and tasks */
	$scope.events = [{
						"id":"51c54235fb4c960b37000014",
						"type":"event",
						"title":"Weekly meeting",
						"start":"2016-04-27T08:00:00+08:00",
						"end":"2016-04-27T10:00:00+08:00",
						"className":"event",
						"allDay":false
					},
					{
						"id":"51c54235fb4c960b37000014",
						"type":"event",
						"title":"One to one",
						"start":"2016-04-26T14:00:00+08:00",
						"end":"2016-04-26T15:00:00+08:00",
						"className":"event",
						"allDay":false
					},
					{
						"id":"51c54235fb4c960b37000014",
						"type":"task",
						"title":"Complete EPAM-1234",
						"start":"2016-04-25T9:00:00+08:00",
						"end":"2016-04-25T18:00:00+08:00",
						"className":"task",
						"allDay":false
					},
					{
						"id":"51c54235fb4c960b37000014",
						"type":"task",
						"title":"Write email to John",
						"start":"2016-04-28T10:00:00+08:00",
						"end":"2016-04-28T11:00:00+08:00",
						"className" : "task",
						"allDay":false
					}
	];

	$scope.eventSources = [$scope.events];
	/* Calendar config object */
	$scope.uiConfig = {
		calendar: {
			height: '100%',
			editable: true,
			header: {
				left: 'today prev,next',
				center: 'title',
				right: 'agendaDay, agendaWeek, month '
			},
			businessHours : {
				start: '10:00',
				end: '18:00',
				dow: [ 1, 2, 3, 4, 5 ]
			},
			firstDay : 1,
			defaultView: "month",
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
