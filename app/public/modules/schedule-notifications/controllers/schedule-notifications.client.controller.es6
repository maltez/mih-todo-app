'use strict';

// Notifications controller
angular.module('schedule-notifications').controller('ScheduleNotificationsController',
	['$scope', '$rootScope', '$stateParams', 'Authentication', 'ScheduleNotifications', '$interval', 'Slots', 'Tasks', 'Notification',
	function($scope, $rootScope, $stateParams, Authentication, ScheduleNotifications, $interval, Slots, Tasks, Notification) {
		$scope.authentication = Authentication;
		
        // TODO: move to common app config
        var notificationsInterval = 1800000; // 30 min

		$rootScope.$on('NEW_TASK_MODIFY', () => {
			$scope.find();
		});
		
		$scope.getTaskDonePercentage = function(task) {
			return +((task.progress * 100) / task.estimation).toFixed(2);
		};
		
		$scope.find = function() {
			$scope.notifications = ScheduleNotifications.query();

            $interval(function(){
                $scope.notifications = ScheduleNotifications.query();
            }, notificationsInterval);
		};
		
		$scope.completeSlot = (slot, overdueTasks) => {		
			var isCurrentTaskPage = false;			
			var overdueTask = getTaskBySlot(overdueTasks, slot);

			if ($stateParams.taskId === overdueTask._id) {
				isCurrentTaskPage = true;
			}
			updateActivity(slot, overdueTask, isCurrentTaskPage);
		};
		
		var getTaskBySlot = (tasks, slot) => {
			return tasks.filter(function(el){
				return el._id === slot.taskId;
			})[0];
		};
		
		var updateActivity = (slot, task, isCurrentTaskPage) => {			
			slot.isComplete = true;

			var slotsQty = $scope.notifications.allSlots.map(function(el){
				return el.taskId === task._id;
			});
			var completeSlotsQty = slotsQty.filter(Boolean);

			Slots.update(slot, () => {
				if (slotsQty.length === completeSlotsQty.length) {
					task.isComplete = true;
				}
				task.progress += slot.duration;
				var progress = +(task.progress / task.estimation * 100).toFixed(2);

				Tasks.update(task, () => {					
					$rootScope.$broadcast('NEW_TASK_MODIFY');
					if (isCurrentTaskPage) {
						$rootScope.$broadcast('COMPLETED_SLOT_FROM_OVERDUE');
					}
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
