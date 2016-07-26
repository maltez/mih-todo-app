'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Users', 'Authentication', 'Events',
	function ($scope, $rootScope, $stateParams, $location, Users, Authentication,  Events) {
		$rootScope.$broadcast('setAsideCategory', 'todo');

		$scope.authentication = Authentication;

		$scope.user = Authentication.user;
		var currentDate = new Date(),
			predefinedEventType = $location.search().event,
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
		
		$scope.eventData = JSON.parse(JSON.stringify(defaultEventData));
		
		$scope.loadEventTemplate = (selectedTemplate) => {
			if (selectedTemplate) {
				$.extend($scope.eventData, selectedTemplate);
				$scope.eventData.type = 'event';
			} else {
				$scope.eventData = angular.copy(defaultEventData);
			}
		};
		
		$scope.loadPredefinedEvent = () => {
			if (predefinedEventType) {
				user.eventTemplates.forEach(template  => {
					if (template.type === predefinedEventType) {
						$scope.loadEventTemplate(template);
						$scope.selectedTemplate = template;
					}
				});
			}
		};

		$scope.loadPredefinedEvent();

		$scope.$on('$locationChangeSuccess', function(event) {
			predefinedEventType = $location.search().event;
			$scope.loadPredefinedEvent();
		});

		$scope.datepicker = {
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

		var saveEventAsTemplate = () => {
			return new Promise(resolve => {
				var user = new Users($scope.user);

				user.eventTemplates.push($scope.eventData);

				user.$update(response => {
					Authentication.user = response;
					resolve();
				}, err => console.error(err));
			});
		};

		$scope.createEvent = function() {
			if (!$scope.eventData.title){
				$scope.eventData.validationError = {
					message : 'Please fill the Title'
				};
				return;
			}
			if ($scope.eventData.isATemplate) {
				saveEventAsTemplate();
			}
			var event = new Events ({
				title: $scope.eventData.title,
				type:  $scope.eventData.type,
				days: {
					startTime: $scope.eventData.withoutDates ? '' : $scope.eventData.startDate,
					endTime: $scope.eventData.withoutDates ? '' : $scope.eventData.endDate
				},
				notes: $scope.eventData.notes,
				isATemplate : $scope.eventData.isATemplate,
				withoutDates: $scope.eventData.withoutDates
			});
			event.$save(function() {
				$location.search('');
				$location.path('/');
			}, function(err) {
				$scope.eventData.validationError  = err.data.message.errors.title;
			});
			$scope.events= [];
		};
		// Find existing Event
		$scope.findEvent = function() {
			$scope.event = Events.get({
				eventId: $stateParams.eventId
			});
		};
		$scope.updateEvent = function() {
			var event = $scope.event;

			event.$update(function() {
				$location.path('events/' + event._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.deleteEvent = function() {
			$scope.event.$remove(function() {
				$location.search('');
				$location.path('/');
			});
		};
		$scope.closeEventForm = function (){
			$location.search('');
			$location.path('/');
		};
		$scope.clearFormData = function() {
			$scope.selectedTemplate = null;
			$scope.eventData =  JSON.parse(JSON.stringify(defaultEventData));
		};
	}]);
