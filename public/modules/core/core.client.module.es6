appConfig.registerModule('core');

angular.module('core')
  .constant('ROUTER', {
    views: {
      aside: {
        templateUrl: 'modules/core/views/sidebar/todo.client.view.html'
      },
      'main-view': {
        templateUrl: 'modules/calendar/views/calendar.client.view.html'
      }
    },
    data: {
      menuLabel: 'plan your day'
    }
  });
