'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Tasks',
	function($scope, $rootScope, $stateParams, $location, Authentication, Tasks) {
		$scope.authentication = Authentication;

		$scope.dt = {
			srartDate : new Date(),
			endDate : new Date()
		};

		$scope.clear = function() {
			return $scope.dt = null;
		};

		$scope.opened = {
			srartDate : false,
			endDate : false
		};

		$scope.openStart = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			return $scope.opened.srartDate = true;
		};
		$scope.openEnd = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			return $scope.opened.endDate = true;
		};

		$scope.dateOptions = {
			srartDate : {
				'year-format': "'yy'",
				'starting-day': 1
			},
			endDate : {
				'year-format': "'yy'",
				'starting-day': 1
			}

		};

		$scope.slider = {
			value: 12,
			options: {
				floor: 0,
				ceil: 24
			}
		};

		$scope.type = 'task';

		// Create new Task
		$scope.create = function() {
			// Create new Task object
			var task = new Tasks ({
				title: this.title,
				type: this.type,
				days: {
					startTime: this.dt.srartDate,
					endTime: this.dt.endDate
				},
				estimation : this.slider.value,
				notes: this.notes
			});
			// Redirect after save
			task.$save(function(response) {
				$location.path('/');

				// Clear form fields
				$scope.title = '';

				$rootScope.$broadcast('NEW_TASK_ADDED');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.tasks= [];
		};

		// Remove existing Task
		$scope.remove = function(task) {
			if ( task ) {
				task.$remove();

				for (var i in $scope.tasks) {
					if ($scope.tasks [i] === task) {
						$scope.tasks.splice(i, 1);
					}
				}
			} else {
				$scope.task.$remove(function() {
					$location.path('tasks');
				});
			}
		};

		// Update existing Task
		$scope.update = function() {
			var task = $scope.task;

			task.$update(function() {
				$location.path('tasks/' + task._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Task
		$scope.findOne = function() {
			$scope.task = Tasks.get({
				taskId: $stateParams.taskId
			});
		};
	}
]);
