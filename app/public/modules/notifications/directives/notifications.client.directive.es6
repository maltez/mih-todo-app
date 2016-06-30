'use strict';

// Notifications controller
angular.module('notifications').directive('notificationTooltip', function(){
    return {
        restrict: 'EA',
        controller: 'NotificationsController',
        templateUrl: '/modules/notifications/views/notifications-tooltip.client.view.html'
    };
});