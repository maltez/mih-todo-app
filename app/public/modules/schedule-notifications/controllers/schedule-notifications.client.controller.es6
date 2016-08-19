'use strict';

// Notifications controller
angular.module('schedule-notifications').controller('ScheduleNotificationsController',
	['$scope', '$rootScope', '$stateParams', 'Authentication', 'ScheduleNotifications', '$interval', 'Slots', 'Tasks', 'Notification',
	function($scope, $rootScope, $stateParams, Authentication, ScheduleNotifications, $interval, Slots, Tasks, Notification) {
		$scope.authentication = Authentication;
		
        // TODO: move to common app config
        var notificationsInterval = 1800000; // 30 min
		var stateParams = $stateParams;

		$rootScope.$on('NEW_TASK_MODIFY', function () {
			$scope.find();
		});

		$scope.find = function() {
			$scope.notifications = ScheduleNotifications.query();

            $interval(function(){
                $scope.notifications = ScheduleNotifications.query();
            }, notificationsInterval);
		};
		
		$scope.completeSlot = (slot, overdueTasks) => {		
			var isCurrentTaskPage = false;
			var overdueTask = overdueTasks.filter(function(el){
				return el._id === slot.taskId;
			})[0];

			if (stateParams.taskId === overdueTask._id) {
				isCurrentTaskPage = true;
			}
			updateActivity(slot, overdueTask, isCurrentTaskPage);
		};
		
		var updateActivity = (slot, task, isCurrentTaskPage) => {
			// todo: task.isComplete = true if all slots completed
			// todo: case - edit page of current task opened (refresh list of slots and progress chart)

			console.log('isCurrentTaskPage', isCurrentTaskPage);
			slot.isComplete = true;
			
			Slots.update(slot, () => {				
				task.progress += slot.duration;
				var progress = +(task.progress / task.estimation * 100).toFixed(2);

				Tasks.update(task, () => {					
					$rootScope.$broadcast('NEW_TASK_MODIFY');
					Notification.success({
						message: `Good job, ${$scope.authentication.user.username}! ${progress}% done.`
					});
				}, (errorResponse) => {
					console.log(errorResponse);
				});
			});
		};
	}
]);
