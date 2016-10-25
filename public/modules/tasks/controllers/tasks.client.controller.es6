'use strict';

class TasksController {
	static get daysMap() {
		return {0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'};
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
			endDate = new Date(endDate),
			estimationDaysRange = [weekDay];

		while (weekDay < endDate) { //Get all days for this period
			estimationDaysRange.push(weekDay);
			weekDay = new Date(weekDay.setDate(weekDay.getDate() + 1));
		}

		return estimationDaysRange;
	}

	static getMaxEstimation(startDate, endDate) {
		return TasksController.getEstimationDaysRange(startDate, endDate).length * 12;
	}

	static getOptimalEstimation(startDate, endDate) {
		// TODO: what is considered optimal?
		let optimalEstimation = 1 /* hour */;
		return optimalEstimation;
	}
}

// Tasks controller
angular.module('tasks').controller('TasksController',
	['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Tasks', 'Users', '$timeout', 'Algorithm',
		'Slots', 'Notification',
		function ($scope, $rootScope, $stateParams, $location, Authentication, Tasks, Users, $timeout, Algorithm,
				  Slots, Notification) {
			$scope.authentication = Authentication;
			$scope.isATemplate = false;
			$scope.user = Authentication.user;
			$scope.selectedTemplate = false;

			$scope.$on('COMPLETED_SLOT_FROM_OVERDUE', function () {
				$timeout(() => {
					$scope.task = getTask();
					$scope.slotsRange = getSlotsByTask();
				});
			});
			
			var date = new Date(),
				dateMax = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));

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
				startDate: {},
				endDate: {}
			};

			$scope.getDisabledDates = (date, mode) => {
				return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
			};

			$scope.clearSlotsList = () => {
				clearSlotsList()
			};

			$scope.$on("slideEnded", function () {
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

				$scope.changeEstimation = (updatedTask) => {
					updateEstimation(updatedTask);
					clearSlotsList();
				};

				$scope.loadTaskTemplate = (selectedTemplate) => {
					if (selectedTemplate) {
						$scope.selectedTemplate = selectedTemplate;
						$.extend($scope.newTask, selectedTemplate);
						delete $scope.newTask._id;
						delete $scope.newTask.$$hashKey;
					} else {
						$scope.selectedTemplate = false;
						$scope.newTask = angular.copy(newTask);
					}
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
					$scope.slotsRange = getSlotsByTask();
				};

				$scope.generateSlots = () => {
					getNewSlots($scope.task);
				};
				$scope.changeEstimation = (updatedTask) => {
					updateEstimation(updatedTask);
					clearSlotsList();
				};
			};

			function removeAvailHoursInfo() {
				delete $scope.timeAvailability;
			}

			var updateEstimation = (model) => {
				let maxEstimation = TasksController.getMaxEstimation(model.days.startTime, model.days.endTime);
				$scope.slider.options.ceil = maxEstimation;
				if (model.estimation > maxEstimation) {
					model.estimation = maxEstimation;
				}
				removeAvailHoursInfo();
			};

			var setEstimationExtremes = (model) => {
				return {
					options: {
						floor: 1,
						hideLimitLabels: true,
						ceil: TasksController.getMaxEstimation(new Date(model.days.startTime), new Date(model.days.endTime)),
						translate: function translate(unit) {
							return unit + 'h';
						}
					}
				};
			};

			var updateTaskTemplates = (model) => {
				return new Promise(resolve => {
					var user = new Users($scope.user);

					if ($scope.selectedTemplate) {
						user.taskTemplates.forEach(template => {
							if (template === $scope.selectedTemplate) {
								template.lastUsingDate = new Date();
							}
						});
					}

					if (model.isATemplate) {
						model.lastUsingDate = new Date();
						user.taskTemplates.push(model);
					}

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
						var slots;

						$scope.slotsRange.map(slot => {
							slot.taskId = response._id;
							slot.userId = Authentication.user._id;
							slot.title = response.title;
							slot.className = ['task', `task-priority-${model.priority}`];
						});
						slots = new Slots($scope.slotsRange);
						slots.$save(resolve);
					}, (errorResponse) => {
						$scope.validationError = errorResponse.data.message.errors;
					});
				});
			};

			var getNewSlots = (model) => {
				Algorithm
					.generateSlots(
						new Date(model.days.startTime),
						new Date(model.days.endTime),
						model.priority,
						model.estimation,
						$scope.user.predefinedSettings.workingHours
					)
					.then(slotsRange => {
						$timeout(() => {
							$scope.timeAvailability = Algorithm.getTimeAvailabilityFromSlotsGroupedByDays();
							return $scope.slotsRange = slotsRange;
						});
					})
				;
			};

			var recalcChart = () => {
				var progress = getFormattedProgress();

				$scope.progress = angular.extend(progress, {
					progressChart: {
						data: [{value: progress.percent, label: "Done"},
							{value: 100 - progress.percent, label: "Left"}],
						colors: ["#1ab394", "#f8ac59"],
						formatter: function formatter(input) {
							return input + '%';
						}
					}
				});
			};

			var getSlotsByTask = ()=> {
				return Tasks.getSlotsByTask({
						taskId: $stateParams.taskId
					}, (slots) => {
						if (!slots.length) {
							$scope.progress = false;
							return;
						}
						$timeout(() => {
							recalcChart();
						}, 100);
					}
				);
			};

			var getTask = (cb) => {
				return Tasks.get({
					taskId: $stateParams.taskId
				}, ()=> {
					if(cb) {
						cb();
					}
				});
			};

			var removeSlotsByTask = () => {
				Tasks.deleteSlotsByTask({
						taskId: $stateParams.taskId
					}
				);
			};

			var clearSlotsList = () => {
				if ($scope.slotsRange && $scope.slotsRange.length) {
					$scope.slotsRange = [];
					Notification.info("Don't forget to generate slots");
				}
			};

			var updateProgress = (slot, task) => {
				slot.isComplete = true;

				Slots.update(slot, () => {
					var slotsQty = $scope.slotsRange.map(function (slot) {
						return !!slot.isComplete;
					});
					var completeSlotsQty = slotsQty.filter(Boolean);

					task.progress += slot.duration;

					if (slotsQty.length === completeSlotsQty.length) {
						task.isComplete = true;
					}

					task.$update(() => {
						recalcChart();
						$rootScope.$broadcast('NEW_TASK_MODIFY');
					}, (errorResponse) => {
						$scope.error = errorResponse.data.message;
					});
				});
			};

			var getFormattedProgress = () => {
				var complete = $scope.task.progress;
				var estimation = $scope.task.estimation;

				return {
					percent: +(complete / estimation * 100).toFixed(2),
					left: estimation - complete,
					done: complete
				};
			};

			$scope.create = (task) => {
				if (task) {
					var queries = [saveTask(task)];

					if (task.isATemplate || $scope.selectedTemplate) {
						queries.push(updateTaskTemplates(task));
					}

					Promise.all(queries).then(() => {
					 $location.path('/');
					 $rootScope.$broadcast('NEW_TASK_MODIFY');
					 Notification.success(`Task "${task.title}" was successfully created`);
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
						$rootScope.$broadcast('NEW_TASK_MODIFY');
						removeSlotsByTask();
						Notification.success(`Task "${task.title}" was successfully removed`);
					});
				} else {
					console.error("Error. Task is not defined");
				}
			};

			$scope.update = (task) => {
				if (task) {
					task.$update(() => {
						$location.path('tasks/' + task._id);
						$rootScope.$broadcast('NEW_TASK_MODIFY');
						Notification.success(`Task "${task.title}" was successfully updated`);
					}, (errorResponse) => {
						$scope.error = errorResponse.data.message;
					});
				} else {
					console.error("Error. Task is not defined");
				}
			};

			$scope.initCreateSlots = () => {
				$scope.createSlot = true;
			};

			$scope.isOverdueSlot = (item) => {
				return (Date.parse(item.start) + 3600000 * item.duration) <= new Date().valueOf();
			};

			$scope.completeSlot = (slot) => {
				updateProgress(slot, $scope.task);
			};
		}
	]);
