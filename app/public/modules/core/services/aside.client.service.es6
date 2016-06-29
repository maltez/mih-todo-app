'use strict';

angular.module('core').service('AsideService', function() {
	var currentCategory = '';

	var setCurrentCategory = (val = 'todo') =>  {
		currentCategory = val;
	};
	var getCurrentCategory = function () {
		return currentCategory;
	};

	return {
		setCurrentCategory: setCurrentCategory,
		getCurrentCategory: getCurrentCategory
	};

});
