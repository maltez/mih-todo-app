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
	['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Tasks', 'Users', '$timeout', 'Algorithm', 'Slots',
		function($scope, $rootScope, $stateParams, $location, Authentication, Tasks, Users, $timeout, Algorithm, Slots) {
			$scope.authentication = Authentication;
			$scope.isATemplate = false;
			$scope.user = Authentication.user;
			$scope.selectedTemplate = {};

			var date = new Date(),
				dateMax = new Date( Date.now() + (365 * 24 * 60 * 60 * 1000));

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

			$scope.clear = () => {
				return $scope.dt = null;
			};

			$scope.opened = {
				startDate: false,
				endDate: false
			};

			$scope.openStart = ($event) => {
				$event.preventDefault();
				$event.stopPropagation();
				return $scope.opened = {
					startDate: true,
					endDate: false
				};
			};
			$scope.openEnd = ($event) => {
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

			$scope.getDisabledDates = (date, mode) => {
				return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
			};
			
			$scope.clearSlotsList = () => {
				clearSlotsList()
			};

			$scope.$on("slideEnded", function() {
				clearSlotsList();
				$scope.$apply();
			});

			$scope.createMode = () => {
				var newTask;
				
				clearSlotsList();
				
				newTask = {
					type: 'task',
					title: '',
					priority: 1,
					estimation: TasksController.getOptimalEstimation($scope.dt.startDate, $scope.dt.endDate),
					notes: '',
					days: {
						startTime: $scope.dt.startDate,
						endTime: $scope.dt.endDate
					},
					withoutDates: false
				};
				$scope.newTask = angular.copy(newTask);
				
				$scope.slider = setEstimationExtremes($scope.newTask);

				$scope.changeEstimation = () => {
					updateEstimation($scope.newTask);
					clearSlotsList();
				};

				$scope.loadTaskTemplate = (selectedTemplate) => {
					if (selectedTemplate) {
						$.extend($scope.newTask, selectedTemplate);
					} else {
						$scope.newTask = angular.copy(newTask);

					}
					$scope.$apply();
				};
				
				$scope.generateSlots = () => {
					getNewSlots($scope.newTask)
				};				

				$scope.$watch('newTask.estimation', (newVal, oldVal) => {
					if (!newVal) {
						$scope.newTask.estimation = oldVal;
					}
				});
			};

			$scope.editMode = () => {
				$scope.task = getTask(() => {
					$scope.slider = setEstimationExtremes($scope.task);
				});

				$scope.getSlotsByTask = () => {
					$scope.daysRange = getSlotsByTask();
				};

				$scope.generateSlots = () => {
					getNewSlots($scope.task);
				};
				$scope.changeEstimation = () => {
					updateEstimation($scope.task);
					clearSlotsList();
				};
			};

			var updateEstimation = (model) => {
				$scope.slider.options.ceil = TasksController.getMaxEstimation(model.days.startTime, model.days.endTime);
				model.estimation = TasksController.getOptimalEstimation(model.days.startTime, model.days.endTime);
			};

			var setEstimationExtremes = (model) => {
				return {
					options: {
						floor: 1,
						ceil: TasksController.getMaxEstimation(new Date(model.days.startTime), new Date(model.days.endTime)),
						translate: function translate(unit) {
							return unit + 'h';
						}
					}
				};
			};

			var saveTaskAsTemplate = (model) => {
				return new Promise(resolve => {
					var user = new Users($scope.user);

					user.templates.push(model);

					user.$update(response => {
						Authentication.user = response;
						resolve();
					}, err => console.error(err));
				});
			};

			var saveTask = (model) => {
				return new Promise(resolve => {
					var task = new Tasks(model);

					if (model.withoutDates) {
						task.days.startTime = task.days.endTime = '';
					}

					task.$save((response) => {
						var days;

						$scope.daysRange.map(day => {
							day.bookSlot(response._id);
							day.bookedSlots.sort((a, b) => a.priority - b.priority);
							return day;
						});

						days = new Days($scope.daysRange);
						days.$save(resolve);
					}, (errorResponse) => {
						$scope.validationError = errorResponse.data.message.errors;
					});
				});
			};

			var getNewSlots = (model) => {
				Algorithm.generateSlots(model.days.startTime, model.days.endTime, model.priority, model.estimation,
					$scope.user.predefinedSettings.workingHours).then((daysRange) => {
					$timeout(() => {
						return $scope.daysRange = daysRange;
					});
				});
			};
			
			var getSlotsByTask = ()=> {
				// todo rewrite static
				return [
					{
						date: new Date(),
						reservedSlot: {duration: 9}
					},
					{
						date: new Date(),
						reservedSlot: {duration: 3}
					}
				];
			};

			var getTask = (cb) => {
				return Tasks.get({
					taskId: $stateParams.taskId
				}, ()=> {
					cb();
				});
			};

			var clearSlotsList = () => {
				if($scope.daysRange && $scope.daysRange.length){
					$scope.daysRange = [];
				}
			};

			$scope.create = (task) => {
				if (task) {
					var queries = [saveTask(task)];

					if (task.isATemplate) { //Add task to user templates
						queries.push(saveTaskAsTemplate(task));
					}

					Promise.all(queries).then(() => {
						$location.path('/');
						$rootScope.$broadcast('NEW_TASK_MODIFY');
					});
				} else {
					console.error("Error. Task is not defined");
				}
			};

			$scope.cancel = () => {
				$location.path('/');
			};

			$scope.remove = (task) => {
				if (task) {
					task.$remove(() => {
						$location.path('/');
					});
					$rootScope.$broadcast('NEW_TASK_MODIFY');
				} else {
					console.error("Error. Task is not defined");
				}
			};

			$scope.update = (task) => {
				if (task) {
					task.$update(() => {
						$location.path('tasks/' + task._id);
						$rootScope.$broadcast('NEW_TASK_MODIFY');
					}, (errorResponse) => {
						$scope.error = errorResponse.data.message;
					});
				} else {
					console.error("Error. Task is not defined");
				}
			};
		}
	]);
