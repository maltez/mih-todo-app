'use strict';

angular.module('core').controller('HomeController', ['$scope', '$injector', 'Authentication', '$location', '$timeout', function ($scope, $injector, Authentication, $location, $timeout) {
	const NotifyBeEmail = $injector.get('NotificationsByEmail');
	var _this = this;

	// If user is not signed in then redirect back home
	if (!Authentication.user) $location.path('/signin');

	this.withSidebar = false;

	$scope.$on('toggleSidebar', function () {
		_this.withSidebar = !_this.withSidebar;

		reRenderDashboardElements();
	});

	var reRenderDashboardElements = () => {
		// refresh estimation slider
		$timeout(function() {
			$scope.$broadcast('rzSliderForceRender');
		}, 600);
	}

	NotifyBeEmail.init({
		// TODO: email frequency will be stored in user settings (future feature)
		// TODO: currently, its 'undefined', emails use default config
		emailRecurrencyHours: Authentication.user.predefinedSettings.emailRecurrencyHours
	});

	$scope.$on('updateUserInfo', function (event, user) {
		// $watch to re-configure service without page reload
		// to use new user settings for email service
		// TODO: email frequency will be stored in user settings (future feature)
		// TODO: currently, its 'undefined', emails use default config
		NotifyBeEmail.init({
			emailRecurrencyHours: user.predefinedSettings.emailRecurrencyHours
		});
	});

}]);
