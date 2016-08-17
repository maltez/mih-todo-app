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
				startDate: currentDate,
				endDate: currentDate,
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
			var event = new Events({
				title: $scope.eventData.title,
				type: $scope.eventData.type,
				days: {
					startTime: $scope.eventData.withoutDates ? '' : $scope.eventData.startDate,
					endTime: $scope.eventData.withoutDates ? '' : $scope.eventData.endDate
				},
				notes: $scope.eventData.notes,
				isATemplate: $scope.eventData.isATemplate,
				withoutDates: $scope.eventData.withoutDates
			});

			Algorithm.getFreeSlots(event.days.startTime, event.days.endTime).then((freeSlots) => {
				$timeout(() => {
					var freeTime = 0,
						days = 0;
					angular.forEach(freeSlots, function (value) {
						freeTime += value.reduce((prev, cur) => prev + cur.duration, 0);
						days++;
					});
					if (freeTime === days * 9) {
						event.$save(function (res) {
							var slots = [];
							$location.search('');
							$location.path('/');
							angular.forEach(freeSlots, function (day, dayId) {
								var slot = {};
								slot.eventId = res._id;
								slot.title = res.title;
								slot.start = new Date(dayId).setHours(0, 0, 0);
								slot.end = new Date(dayId).setHours(23, 59, 0);
								slot.duration = 9;
								slot.className = "event";
								slots.push(slot);
							});
							slots = new Slots(slots);
							slots.$save();
						}, function (err) {
							$scope.eventData.validationError = err.data.message.errors.title;
						});
						$scope.events = [];
					} else {
						Notification.error({message: 'You don\'t have enough time for this event'});
					}
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
