class ModalsService {
	/** @ngInject */
	constructor(ngDialog) {
		Object.assign(this, {
			ngDialog
		});
	}

	getModalWindowOpen() {
		this.ngDialog.open({
			template: '/modules/modals/views/modals.view.html',
			controller: 'ModalsController',
			controllerAs: 'modal',
			width: '40%',
			className: 'ngdialog-theme-default'
		});
	}
}

angular.module('modals').service('ModalsService', ModalsService);
