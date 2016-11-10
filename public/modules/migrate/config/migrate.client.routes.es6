'use strict';

/** @ngInject */
let migrationRoute = ($stateProvider) => {
	$stateProvider
		.state('migrate', {
			url: '/migrate',
			views: {
				'main-view@': {
					templateUrl: 'modules/migrate/views/migrate.view.html'
				}
			}
		});
};

angular.module('migrate').config(migrationRoute);
