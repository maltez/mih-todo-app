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
      warning: this.$scope.ngDialogData.WARNING_MSG,
      title: this.$scope.ngDialogData.WARNING_MSG,
      firstWay: this.$scope.ngDialogData.BUTTONS_MSG.FIRST_WAY,
      secondWay: this.$scope.ngDialogData.BUTTONS_MSG.SECOND_WAY
    }
  }

  firstWayHandle() {
    this.$rootScope.$broadcast(`CONFLICTED_${this.$scope.ngDialogData.TYPE}_FIRST`);
  }

  secondWayHandle() {
    this.$rootScope.$broadcast(`CONFLICTED_${this.$scope.ngDialogData.TYPE}_SECOND`);
  }

  abilityToShiftExistingSlots() {
    //needs to be replaced from this controller
    return true;
  }
}

angular.module('modals').controller('ModalsController', ModalsController);
