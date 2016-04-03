'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
	function ($window) {
		var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

		owaspPasswordStrengthTest.config({
			allowPassphrases       : false,
			maxLength              : 10,
			minLength              : 6,
			minOptionalTestsToPass : 1
		});

		return {
			getResult: function (password) {
				var result = owaspPasswordStrengthTest.test(password);

				result.errors = result.errors.map(function(el){
					return el.replace('The password must', '-').replace('The password may', '-');
				});
				return result;
			},
			getPopoverMsg: function () {
				var popoverMsg = 'Please enter a passphrase or password with greater than 6 characters, numbers, lowercase, upppercase, and special characters.';
				return popoverMsg;
			}
		};
	}
]);
