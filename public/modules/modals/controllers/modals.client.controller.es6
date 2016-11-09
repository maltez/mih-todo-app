class ModalsController {

  /** @ngInject */
  constructor(ModalsService, $scope, $rootScope) {
    Object.assign(this, {
      ModalsService,
      $scope,
      $rootScope
    });
  }

  renderModalData() {
    return {
      warning: this.$scope.ngDialogData.warningMsg,
      title: this.$scope.ngDialogData.modalTitle,
      firstHandler: this.$scope.ngDialogData.buttonsMsg.firstHandler,
      secondHandler: this.$scope.ngDialogData.buttonsMsg.secondHandler
    };
  }

  firstWayHandle() {
    this.$rootScope.$broadcast(`CONFLICTED_${this.$scope.ngDialogData.type}_FIRST`);
  }

  secondWayHandle() {
    this.$rootScope.$broadcast(`CONFLICTED_${this.$scope.ngDialogData.type}_SECOND`);
  }
}

angular.module('modals').controller('ModalsController', ModalsController);
