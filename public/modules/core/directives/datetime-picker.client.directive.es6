'use strict';
angular.module('core')
.directive('datetimePicker', function(){
	return {
		restrict: 'E',
		templateUrl : '/modules/core/views/datetime-picker.client.view.html',
		scope: {
			label: '@',
			type: '@',
			pickerId: '@',
			linkedPickerId: '@',
			activity: '='
		},
		link : (scope, element) => {
			var datepickerElement = $(element).find('.datetime-picker'),
				datepickerType = scope.type;

			scope.$watch('activity.days', function(days) {

				if(days) {
					datepickerElement.datetimepicker({
						sideBySide: true,
						format: "DD.MM HH:mm a",
						stepping: 30,
						showTodayButton: true,
						showClose: true,
						toolbarPlacement: 'bottom',
						minDate: new Date(days[datepickerType]) - 29 * 60000,
						defaultDate: days[datepickerType],
						locale: 'en-gb',
						tooltips: {
							today: 'Go to today',
							close: 'Close the picker'
						},
						icons: {
							close: "fa fa-check"
						}
					});

					scope.activity.days[datepickerType] = datepickerElement.data("DateTimePicker").date().toISOString();

					datepickerElement.on("dp.change", (e) => {
						scope.activity.days[datepickerType] = e.date.toISOString();

						if (scope.activity.type == 'task') {
							scope.$parent.changeEstimation(scope.activity);
							scope.$apply();
						}

						if (scope.linkedPickerId) {
							$('#' + scope.linkedPickerId).data("DateTimePicker").minDate(e.date);
						}
					});
				}
			}, true);
		}
	};
});
