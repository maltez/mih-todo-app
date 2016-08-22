'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Users', 'Authentication', 'Events', '$timeout', 'Algorithm', 'Slots', 'Notification',
	function ($scope, $rootScope, $stateParams, $location, Users, Authentication, Events, $timeout, Algorithm, Slots, Notification) {
		$rootScope.$broadcast('setAsideCategory', 'todo');

		$scope.selectedTemplate = false;
		$scope.authentication = Authentication;

		$scope.user = Authentication.user;
		var currentDate = new Date(),
			predefinedEventType = $location.search().event,
			defaultEventData = {
				days : {
					startTime: currentDate,
					endTime: currentDate
				},
				type: 'event',
				isATemplate: false,
				withoutDates: false,
				title: undefined,
				validationError: undefined,
				notes: undefined
			};

		$scope.eventData = JSON.parse(JSON.stringify(defaultEventData));

		$scope.loadEventTemplate = (selectedTemplate) => {
			if (selectedTemplate) {
				$.extend($scope.eventData, selectedTemplate);
				$scope.eventData.type = 'event';
				$scope.selectedTemplate = selectedTemplate;
				delete $scope.eventData._id;
				delete $scope.eventData.$$hashKey;
			} else {
				$scope.eventData = angular.copy(defaultEventData);
				$scope.selectedTemplate = false;
			}
		};

		$scope.loadPredefinedEvent = () => {
			if (predefinedEventType) {
				user.eventTemplates.forEach(template => {
					if (template.type === predefinedEventType) {
						$scope.loadEventTemplate(template);
						$scope.selectedTemplate = template;
					}
				});
			}
		};

		$scope.loadPredefinedEvent();

		$scope.$on('$locationChangeSuccess', function () {
			predefinedEventType = $location.search().event;
			$scope.loadPredefinedEvent();
		});

		$scope.datepicker = {
			currentDate: currentDate,
			startDate: {
				isOpened: false
			},
			endDate: {
				isOpened: false
			}
		};
		$scope.openDatepicker = function ($event, openedDatepicker) {
			var closedDatepicker = openedDatepicker == 'startDate' ? 'endDate' : 'startDate';
			$event.preventDefault();
			$event.stopPropagation();
			$scope.datepicker[openedDatepicker].isOpened = true;
			$scope.datepicker[closedDatepicker].isOpened = false;
		};

		var updateEventTemplates = (model) => {
			var user = new Users($scope.user);

			if ($scope.selectedTemplate) {
				user.eventTemplates.forEach(template => {
					if (template === $scope.selectedTemplate) {
						template.lastUsingDate = new Date();
					}
				});
			}

			if (model.isATemplate) {
				model.lastUsingDate = new Date();
				user.eventTemplates.push(model);
			}

			user.$update(response => {
				Authentication.user = response;
			}, err => console.error(err));
		};

		$scope.createEvent = function () {
			if (!$scope.eventData.title) {
				$scope.eventData.validationError = {
					message: 'Please fill the Title'
				};
				return;
			}

			if ($scope.eventData.isATemplate || $scope.selectedTemplate) {
				updateEventTemplates($scope.eventData);
			}
			var event = new Events($scope.eventData);

			Algorithm.getFreeSlots(event.days.startTime, event.days.endTime).then((freeSlots) => {
				$timeout(() => {
					var freeTime = 0,
						days = 0;
					event.$save(function (res) {
						var slots = [];
						$location.search('');
						$location.path('/');
						var slot = {};
						slot.eventId = res._id;
						slot.title = res.title;
						slot.start = event.days.startTime;
						slot.end = event.days.endTime;
						slot.duration = (new Date(event.days.endTime) - new Date(event.days.startTime)) / 1000 / 60 / 60 ;
						slot.className = "event";
						slot.userId = Authentication.user._id;
						slots.push(slot);
						slots = new Slots(slots);
						slots.$save();
					}, function (err) {
						$scope.eventData.validationError = err.data.message.errors.title;
					});
					$scope.events = [];
				});
			});
		};
		// Find existing Event
		$scope.findEvent = function () {
			$scope.event = Events.get({
				eventId: $stateParams.eventId
			});
		};
		$scope.updateEvent = function () {
			var event = $scope.event;

			event.$update(function () {
				$location.path('events/' + event._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.deleteEvent = function () {
			$scope.event.$remove(function () {
				$location.search('');
				$location.path('/');
			});
		};
		$scope.closeEventForm = function () {
			$location.search('');
			$location.path('/');
		};
		$scope.clearFormData = function () {
			$scope.selectedTemplate = null;
			$scope.eventData = JSON.parse(JSON.stringify(defaultEventData));
		};
	}]);
