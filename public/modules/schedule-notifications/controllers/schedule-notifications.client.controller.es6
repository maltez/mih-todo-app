'use strict';

// Notifications controller
angular.module('schedule-notifications').controller('ScheduleNotificationsController',
	['$scope', '$rootScope', '$stateParams', 'Authentication', 'ScheduleNotifications', '$interval', '$location', '$state', 'Slots', 'Tasks', 'Notification',
	function($scope, $rootScope, $stateParams, Authentication, ScheduleNotifications, $interval, $location, $state, Slots, Tasks, Notification) {
		$scope.authentication = Authentication;
		
        // TODO: move to common app config
        var notificationsInterval = 1800000; // 30 min

		$rootScope.$on('NEW_TASK_MODIFY', () => {
			$scope.find();
		});
		
		$scope.getTaskDonePercentage = (task) => {
			return getOverdueTaskProgress(task).percent;
		};
		
		$scope.find = () => {
			$scope.notifications = ScheduleNotifications.query();

            $interval(() => {
                $scope.notifications = ScheduleNotifications.query();
            }, notificationsInterval);
		};
		
		$scope.completeSlot = (slot) => {	
			var cfg = getFormattedDataForCompleteSlot(slot);

			if ($stateParams.taskId === cfg.overdueTask._id) {
				cfg.isCurrentTaskPage = true;
			}
			updateActivity(cfg);
		};

		var getOverdueTaskProgress = (task) => {
			return {
				percent: +((task.progress * 100) / task.estimation).toFixed(2)
			}
		};

		var getFormattedDataForCompleteSlot = (slot) => {
			var allSlots = $scope.notifications.allSlots;
			var overdueTasks = $scope.notifications.overdueTasks;
			var overdueSlots = $scope.notifications.overdueSlots;
			var overdueTaskBySlot = getTaskBySlot(overdueTasks, slot);
			var overdueTaskSlots = allSlots.filter(function (slot) {
				return slot.taskId === overdueTaskBySlot._id;
			});
			var completeSlotsQty = overdueTaskSlots.filter(function (slot) {
				return slot.isComplete;
			}).length;

			return {
				slotToComplete: slot,
				isCurrentTaskPage: false,
				overdueTask: overdueTaskBySlot,
				overdueTaskProgress: getOverdueTaskProgress(overdueTaskBySlot).percent,
				overdueTasksQty: overdueTasks.length,
				overdueSlotsQty: overdueSlots.filter(function (slot) {
					return slot.taskId === overdueTaskBySlot._id;
				}).length,
				isCompetedTask: (overdueTaskSlots.length - 1 === completeSlotsQty)
			}
		};
		
		var getTaskBySlot = (tasks, slot) => {
			return tasks.filter(function(el){
				return el._id === slot.taskId;
			})[0];
		};

		var updateActivity = (cfg) => {
			cfg.slotToComplete.isComplete = true;
			Slots.update(cfg.slotToComplete,
				() => updateOverdueSlotSuccessHandler(cfg));
		};

		var updateOverdueSlotSuccessHandler = (cfg) => {
			if (cfg.isCompetedTask) {
				cfg.overdueTask.isComplete = true;
			}
			cfg.overdueTask.progress += cfg.slotToComplete.duration;

			Tasks.update(cfg.overdueTask, 
				() => updateOverdueTaskSuccessHandler(cfg), 
				(errorResponse) => {
				console.log(errorResponse);
			});
		};
		
		var updateOverdueTaskSuccessHandler = (cfg) => {
			var overdueTaskProgress = getOverdueTaskProgress(cfg.overdueTask).percent;
			
			if (!cfg.isCurrentTaskPage) {
				if (cfg.overdueTasksQty === 1 && cfg.overdueSlotsQty === 1) {
					$location.path('/');
				}
				
				if (cfg.isCompetedTask) {
					Notification.success({message: `Good job, ${$scope.authentication.user.username}! Task complete.`});
				} else {
					Notification.success({message: `Good job, ${$scope.authentication.user.username}! ${overdueTaskProgress}% done.`});
				}
				
			} else {
				$rootScope.$broadcast('COMPLETED_SLOT_FROM_OVERDUE');
			}

			$rootScope.$broadcast('NEW_TASK_MODIFY');
		};
	}
]);
