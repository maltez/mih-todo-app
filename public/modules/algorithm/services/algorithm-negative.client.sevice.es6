class AlgorithmNegative {

  /** @ngInject */
  constructor($rootScope, ModalsService, MODALS_TASK_MESSAGES, MODALS_EVENT_MESSAGES, MODALS_EVENTS) {
    Object.assign(this, {
      $rootScope,
      ModalsService,
      MODALS_TASK_MESSAGES,
      MODALS_EVENT_MESSAGES,
      MODALS_EVENTS
    });

    this.slotTypes = {
      task : 'task',
      event: 'event'
    };

    this.$rootScope.$on(this.MODALS_EVENTS.taskFirst, () => {
      this.closeModalInstance();
    });
    this.$rootScope.$on(this.MODALS_EVENTS.taskSecond, () => {
      this.recalculateExistingTasks();
    });

    this.$rootScope.$on(this.MODALS_EVENTS.eventFirst, () => {
      this.closeModalInstance();
    });
    this.$rootScope.$on(this.MODALS_EVENTS.eventSecond, event => {
      console.log('second event fired', event);
    });
  }

  openModalForDecision(slotType) {
    let msg = (slotType === this.slotTypes.task) ? this.MODALS_TASK_MESSAGES : this.MODALS_EVENT_MESSAGES;
    this.ModalsService.getModalWindowOpen(msg);
  }

  closeModalInstance() {
    this.ModalsService.getModalWindowClose();
  }

  recalculateExistingTasks() {
    console.log(this.estimation, this.priority, this.startDate, this.endDate);
  }
}

angular.module('algorithm').service('AlgorithmNegative', AlgorithmNegative);
