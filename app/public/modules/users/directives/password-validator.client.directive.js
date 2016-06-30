'use strict';
angular.module('users')
.directive('passwordValidator', ['PasswordValidator', "$popover", function(PasswordValidator,$popover ) {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs) {

			var	validationPopover = $popover(element, {
				contentTemplate: 'validationErrorsTmp.html',
				html: true,
				trigger: 'focus',
				autoClose: false,
				placement: 'right-bottom',
				scope: scope
			});
			scope.errors = PasswordValidator.getResult("").errors;
			scope.validatePassword = function() {
				var password = element.val(),
					result = PasswordValidator.getResult(password);
				scope.errors = result.errors;
				scope.errors.length == 0 ?  validationPopover.hide() : validationPopover.show();
			};

			scope.notifyIfInvalid = function() {
				scope.errors.length == 0 ? (element.addClass("valid"), $(element).closest('.form-group').removeClass("has-error")) :  $(element).closest('.form-group').addClass("has-error");
				scope.signupForm.password.$setValidity("password", scope.errors.length == 0);
			};
		}
	};
}]);
