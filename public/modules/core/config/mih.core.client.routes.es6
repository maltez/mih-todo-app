const router = ($stateProvider, $urlRouterProvider, ROUTER) => {
  const HOME_URL = '/todo';

  // Redirect to home view when route not found
  $urlRouterProvider.otherwise(HOME_URL);
  $stateProvider
    .state('todo_state', {
      url: HOME_URL,
      views: ROUTER.views,
      data: ROUTER.data
    })
  ;
};

angular
  .module('core')
  .config(['$stateProvider', '$urlRouterProvider', 'ROUTER', router]);
