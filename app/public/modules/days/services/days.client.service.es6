'use strict';

//Tasks service used to communicate Tasks REST endpoints
angular.module('days').factory('Days', ['$resource',
	function($resource) {
		return $resource('days', {});
	}
]);
