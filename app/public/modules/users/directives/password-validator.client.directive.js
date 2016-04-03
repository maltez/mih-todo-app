'use strict';
angular.module('users')
.directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.unshift(function (password) {
				var result = PasswordValidator.getResult(password);
				var strengthIdx = 0;

				// Strength Meter - visual indicator for users
				var strengthMeter = [
					{ color: 'danger', progress: '20' },
					{ color: 'warning', progress: '40' },
					{ color: 'info', progress: '60' },
					{ color: 'primary', progress: '80' },
					{ color: 'success', progress: '100' }
				];
				var strengthMax = strengthMeter.length;

				if (result.errors.length < strengthMeter.length) {
					strengthIdx = strengthMeter.length - result.errors.length - 1;
				}

				scope.strengthColor = strengthMeter[strengthIdx].color;
				scope.strengthProgress = strengthMeter[strengthIdx].progress;

				if (result.errors.length) {
					scope.popoverMsg = result.errors;
					scope.passwordErrors = result.errors;
					angular.element('.password-group .popover').show();

					modelCtrl.$setValidity('strength', false);
					return undefined;
				} else {
					scope.popoverMsg = '';
					scope.passwordErrors = '';
					angular.element('.password-group .popover').hide();
					//element.attr('is-open', 'false');
					modelCtrl.$setValidity('strength', true);
					return password;
				}
			});
		}
	};
}]);

angular.module('users').directive("customPopover", ["$popover", function($popover) {
	var errorsCount;
	return {
		restrict: "A",
		link: function(scope, element, attrs) {
			var myPopover = $popover(element, {
				contentTemplate: 'example.html',
				html: true,
				trigger: 'focus',
				autoClose: false,
				scope: scope
			}),
			password = element.val(),
			result = owaspPasswordStrengthTest.test(password);
			scope.errors = result.errors;
			errorsCount = result.errors.length;
			scope.showPopover = function() {
				var password = element.val(),
				result = owaspPasswordStrengthTest.test(password);
				scope.errors = result.errors;
				console.log('errorsCount', errorsCount);
				if (errorsCount != result.errors.length) {
					console.log('should be recalculated');
					console.log('mypopover', myPopover);
					errorsCount = result.errors.length;
				}
				if (scope.errors.length == 0)  myPopover.hide();
			}
		}
	}
}]);
