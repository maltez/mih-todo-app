'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$location', 'Events',
	function ($scope, $location, Events) {
		var currentDate = new Date(),
			defaultEventData = {
				startDate : currentDate,
				endDate : currentDate,
				type : 'event',
				isATemplate : false,
				withoutDates : false,
				title : undefined,
				validationError : undefined,
				notes : undefined
			};
		$scope.datepicker = {
			options : {
				'year-format': 'yy',
				'starting-day': 1
			},
			currentDate : currentDate,
			startDate : {
				isOpened : false
			},
			endDate : {
				isOpened : false
			}
		};
		$scope.openDatepicker = function($event, openedDatepicker) {
			var closedDatepicker = openedDatepicker == 'startDate' ? 'endDate' : 'startDate';
			$event.preventDefault();
			$event.stopPropagation();
			$scope.datepicker[openedDatepicker].isOpened = true;
			$scope.datepicker[closedDatepicker].isOpened = false;
		};

		$scope.eventData = JSON.parse(JSON.stringify(defaultEventData));
		$scope.createEvent = function() {
			if (!$scope.eventData.title){
				$scope.eventData.validationError = {
					message : 'Please fill the Title'
				};
				return;
			}
			var event = new Events ({
				title: $scope.eventData.title,
				type:  $scope.eventData.type,
				days: {
					startTime: $scope.eventData.withoutDates ? '' : $scope.eventData.startDate,
					endTime: $scope.eventData.withoutDates ? '' : $scope.eventData.endDate
				},
				notes: $scope.eventData.notes,
				isATemplate : $scope.eventData.isATemplate
			});
			event.$save(function() {
				$location.path('/');
			}, function(err) {
				$scope.eventData.validationError  = err.data.message.errors.title;
			});
			$scope.events= [];
		};
		$scope.closeEventForm = function (){
			$location.path('/');
		};
		$scope.clearFormData = function() {
			$scope.eventData =  JSON.parse(JSON.stringify(defaultEventData));
		};
	}]);
