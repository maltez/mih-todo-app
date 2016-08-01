'use strict';

// Notifications controller
angular.module('schedule-notifications').controller('ScheduleNotificationsController',
	['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'ScheduleNotifications', '$interval',
	function($scope, $rootScope, $stateParams, $location, Authentication, ScheduleNotifications, $interval) {
		$scope.authentication = Authentication;
		
		$rootScope.$broadcast('setAsideCategory', 'overdue');
		
        // TODO: move to common app config
        var notificationsInterval = 1800000; // 30 min

		// Create new Notification
		$scope.create = function() {
			// Create new Notification object
			var notification = new ScheduleNotifications ({
				name: this.name
			});

			// Redirect after save
			notification.$save(function(response) {
				$location.path('notifications/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Notification
		$scope.remove = function(notification) {
			if ( notification ) { 
				notification.$remove();

				for (var i in $scope.notifications) {
					if ($scope.notifications [i] === notification) {
						$scope.notifications.splice(i, 1);
					}
				}
			} else {
				$scope.notification.$remove(function() {
					$location.path('notifications');
				});
			}
		};

		// Update existing Notification
		$scope.update = function() {
			var notification = $scope.notification;

			notification.$update(function() {
				$location.path('notifications/' + notification._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notifications
		$scope.find = function() {
			$scope.notifications = ScheduleNotifications.query();

            $interval(function(){
                $scope.notifications = ScheduleNotifications.query();
            }, notificationsInterval);
		};

		// Find existing Notification
		$scope.findOne = function() {
			$scope.notification = ScheduleNotifications.get({ 
				notificationId: $stateParams.notificationId
			});
		};

		$scope.closeView = function () {
			$location.path('/');
		};

		// todo: move to progress controller; rewrite static
		$scope.progressChart = {
			data: [
				{label: "Completed", value: 50},
				{label: "To do", value: 50}
			],
			colors: ["#31C0BE", "#c7254e"],
			formatter: function (input) {
				return input + '%';
			}
		};
	}
]);
