'use strict';

class TasksController {
	static get daysMap() {
		return { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu',  5: 'fri', 6: 'sat' };
	}

	static timeToMinutes(time) {
		var timeMap = time.split(':'),
			minutes = 0;

		minutes += parseInt(timeMap[0], 10) * 60;
		minutes += parseInt(timeMap[1], 10);

		return minutes;
	};

	static getEstimationDaysRange(startDate, endDate) {
		var weekDay = new Date(startDate),
			estimationDaysRange = [weekDay];

		while(weekDay < endDate) { //Get all days for this period
			estimationDaysRange.push(weekDay);
			weekDay = new Date(weekDay.setDate(weekDay.getDate() + 1));
		}

		return estimationDaysRange;
	}

	static getMaxEstimation(startDate, endDate) {
		return TasksController.getEstimationDaysRange(startDate, endDate).length * 12;
	}

	static getOptimalEstimation(startDate, endDate) {
		var maxEstimationTime = 0,
			bookedTime = 0;

		user.predefinedSettings.booked.forEach(time => {
			bookedTime += (TasksController.timeToMinutes(time.endTime) - TasksController.timeToMinutes(time.startTime));
		});

		TasksController.getEstimationDaysRange(startDate, endDate).forEach(day => { //Get worked hours for this day
			let dayOptions = window.user.predefinedSettings.workingHours[TasksController.daysMap[day.getDay()]];

			if (dayOptions.isWorkingDay) {
				maxEstimationTime += TasksController.timeToMinutes(dayOptions.end) - TasksController.timeToMinutes(dayOptions.start) - bookedTime;
			}
		});

		return Math.floor(maxEstimationTime / 60);
	}
}

// Tasks controller
angular.module('tasks').controller('TasksController',
	['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Tasks', 'Users', '$timeout', 'Algorithm', 'Days',
	function($scope, $rootScope, $stateParams, $location, Authentication, Tasks, Users, $timeout, Algorithm, Days) {
		$scope.authentication = Authentication;
		$scope.saveAsDraft = false;
		$scope.user = Authentication.user;
		$scope.selectedTemplate = {};
		
		$rootScope.$broadcast('setAsideCategory', 'todo');

		var date = new Date(),
			dateMax = new Date( Date.now() + (365*24*60*60*1000));

		$scope.dt = {
			startDate: date,
			endDate: date
		};

		var d = new Date();
		d.setHours(9);
		d.setMinutes(0);

		var d2 = new Date();
		d2.setHours(18);
		d2.setMinutes(0);

		$scope.startTime = d;
		$scope.endTime = d2;

		$scope.startDate = {
			minDate: date,
			maxDate: dateMax
		};

		$scope.endDate = {
			minDate: date,
			maxDate: dateMax
		};

		$scope.clear = function () {
			return $scope.dt = null;
		};

		$scope.opened = {
			startDate: false,
			endDate: false
		};

		$scope.openStart = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			return $scope.opened = {
				startDate: true,
				endDate: false
			};
		};
		$scope.openEnd = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.dt.endDate = $scope.dt.startDate;
			$scope.endDate.minDate = $scope.dt.startDate;
			return $scope.opened = {
				startDate: false,
				endDate: true
			};
		};

		$scope.dateOptions = {
			startDate: {
				'year-format': 'yy',
				'starting-day': 1

			},
			endDate: {
				'year-format': 'yy',
				'starting-day': 1
			}
		};

			var newTask = {
				type: 'task',
				title: '',
				priority: 1,
				estimation: TasksController.getOptimalEstimation($scope.dt.startDate, $scope.dt.endDate),
				notes: '',
				days: {
					startDate: $scope.dt.startDate,
					endDate: $scope.dt.endDate
				},
				withOutDate: false
			};

		$scope.newTask = angular.copy(newTask);

		$scope.changeEstimation = () => {
			$scope.slider.options.ceil = TasksController.getMaxEstimation($scope.newTask.days.startDate, $scope.newTask.days.endDate);
			$timeout(() => { //For some reason, estimation input sometimes don't updates
				$scope.newTask.estimation = TasksController.getOptimalEstimation($scope.newTask.days.startDate, $scope.newTask.days.endDate);
			});
		};

		$scope.slider = {
			options: {
				floor: 1,
				ceil: TasksController.getMaxEstimation($scope.newTask.days.startDate, $scope.newTask.days.endDate),
				translate(unit) {
					return unit + 'h';
				}
			}
		};

		$scope.getDisabledDates = function(date, mode) {
			return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		};


		var saveTaskAsTemplate = () => {
			return new Promise(resolve => {
				var user = new Users($scope.user);

				user.templates.push($scope.newTask);

				user.$update(response => {
					Authentication.user = response;
					resolve();
				}, err => console.error(err));
			});
		};

		var saveTask = () => {
			return new Promise(resolve => {
				var task = new Tasks($scope.newTask);

				if ($scope.newTask.withOutDate) {
					task.days.startDate = task.days.endDate = '';
				}

				task.$save(function (response) {
					console.log(response._id)
					$scope.daysRange.forEach(day => day.bookSlot(response._id));

					var days = new Days($scope.daysRange);

					days.$save(resolve);
				}, function (errorResponse) {
					$scope.validationError = errorResponse.data.message.errors;
				});
			});
		};

		// Create new Task
		$scope.create = function() {
			var queries = [saveTask()];

			if ($scope.newTask.saveAsDraft) { //Add task to user templates
				queries.push(saveTaskAsTemplate());
			}

			$scope.tasks = [];

			Promise.all(queries).then(() => {
				$location.path('/');
				$scope.title = '';
				$rootScope.$broadcast('NEW_TASK_MODIFY');
			});
		};

		$scope.cancel = function () {
			$location.path('/');
		};

		// Remove existing Task
		$scope.remove = function (task) {
			if (task) {
				task.$remove();

				for (var i in $scope.tasks) {
					if ($scope.tasks[i] === task) {
						$scope.tasks.splice(i, 1);
					}
				}
				$rootScope.$broadcast('NEW_TASK_MODIFY');
			} else {
				$scope.task.$remove(function () {
					$location.path('/');
				});
				$rootScope.$broadcast('NEW_TASK_MODIFY');
			}
		};


		// Update existing Task
		$scope.update = function () {
			var task = $scope.task;
			task.title = $scope.title;

			task.$update(function () {
				$location.path('tasks/' + task._id);
				$rootScope.$broadcast('NEW_TASK_MODIFY');
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Task
		$scope.findOne = function () {
			$scope.task = Tasks.get({
				taskId: $stateParams.taskId
			});
		};

		$scope.loadTaskTemplate = (selectedTemplate) => {
			if (selectedTemplate) {
				$.extend($scope.newTask, selectedTemplate);
			} else {
				$scope.newTask = angular.copy(newTask);
			}
		};

		$scope.$watch('newTask.estimation', (newVal, oldVal) => {
			if (!newVal) {
				$scope.newTask.estimation = oldVal;
			}
		});

		$scope.daysRange = {};

		$scope.generateSlots = () => {
			Algorithm.generateSlots(
				$scope.newTask.days.startDate,
				$scope.newTask.days.endDate,
				$scope.newTask.priority,
				$scope.newTask.estimation,
				$scope.user.predefinedSettings.workingHours
			).then(daysRange => {
				$timeout(() => $scope.daysRange = daysRange);
			});
		}
	}
]);
