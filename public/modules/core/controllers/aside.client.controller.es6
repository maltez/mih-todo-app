'use strict';

angular.module('core').controller('SidebarController', ['$scope', '$injector',
	function ($scope, $injector) {
		let $state = $injector.get('$state');

		let Ctrl = this;
		Ctrl.topStatesInNavDropdown = [
			$state.get('todo_state'),
			$state.get('overdue'),
			$state.get('templates')
		];

		Ctrl.goToState = function (newState) {
			if (!newState) return;
			$state.go(newState);
		};

		// $state.current isn't available yet,
		// but we need to display selectedTopState in the navigation dropdown
		// that's why we subscribe to $stateChangeSuccess event,
		// and then investigate which topState is parent to the current $state
		$scope.$on('$stateChangeSuccess', function (event, currentState, toParams, fromState, fromParams) {
			// $state.current === currentState;

			let topStateToDisplayInNavDropdown = _.find(Ctrl.topStatesInNavDropdown, function (oneOfParentNavStates) {
				// find appropriate top state and attach to the view
				return $state.includes(oneOfParentNavStates.name);
			});
			if (topStateToDisplayInNavDropdown) {
				// always set TOP STATE to enable site navigation via dropdown
				// DO _NOT_ DO IT THIS WAY: Ctrl.selectedTopState = currentState;
				// setting currentState will add an empty option to dropdown
				Ctrl.selectedTopState = topStateToDisplayInNavDropdown;
			}

		});

	}]);
