class ModalsController {
	
	/** @ngInject */
	constructor(ModalsService, $scope) {
		Object.assign(this, {
			ModalsService,
			$scope
		});
	}

	userInterrupts() {
		//show how much time user need to free up
		console.log('ALIVE');
	}

	automaticSlotShift() {
		console.log('ALIVE ONE MORE TIME');
	}

	abilityToShiftExistingSlots() {
		return false;
	}
}

angular.module('modals').controller('ModalsController', ModalsController);
