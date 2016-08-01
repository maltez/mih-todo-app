'use strict';

angular.module('schedule-notifications').directive('notificationTooltip', function(){
    return {
        restrict: 'EA',
        controller: 'ScheduleNotificationsController',
        templateUrl: '/modules/schedule-notifications/views/notifications-tooltip.client.view.html'
    };
});
