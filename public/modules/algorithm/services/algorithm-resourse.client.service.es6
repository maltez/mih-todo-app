'use strict';

//Tasks service used to communicate Tasks REST endpoints
angular.module('algorithm').factory('AlgorithmServer', ['$resource',
	function($resource) {
		return $resource('algorithm/:q', {});
	}
]);
