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

		owaspPasswordStrengthTest.tests.optional = owaspPasswordStrengthTest.tests.optional.filter(function(val){
			return !(/one special character/).test(val);
		});

		return {
			getResult: function (password) {
				var result = owaspPasswordStrengthTest.test(password);
				result.errors = result.errors.map(function(val){
					return val.replace(/The password (must|may)/g, '-');
				});
				return result;
			}
		};
	}
]);
