class AlgorithmNegative {

  /** @ngInject */
  constructor($rootScope, ModalsService, taskMessages, eventMessages) {
    Object.assign(this, {
      $rootScope,
      ModalsService,
      taskMessages,
      eventMessages
    });

    this.$rootScope.$on('CONFLICTED_TASK_FIRST', () => {
      this.closeModalInstance();
    });

    this.$rootScope.$on('CONFLICTED_TASK_SECOND', event => {
      console.log('second fired', event);
    });
  }

  openModalForDecision(slotType) {
    let msg = (slotType === 'task') ? this.taskMessages : this.eventMessages;

    this.ModalsService.getModalWindowOpen(msg);
  }

  closeModalInstance() {
    this.ModalsService.getModalWindowClose();
  }
}

angular.module('algorithm').service('AlgorithmNegative', AlgorithmNegative);
