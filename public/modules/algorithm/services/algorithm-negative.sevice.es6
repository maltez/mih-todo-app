class AlgorithmNegative {

  /** @ngInject */
  constructor(AlgorithmServer, $rootScope, ModalsService, MODALS_TASK_MESSAGES, MODALS_EVENT_MESSAGES, MODALS_EVENTS) {
    Object.assign(this, {
      AlgorithmServer,
      $rootScope,
      ModalsService,
      MODALS_TASK_MESSAGES,
      MODALS_EVENT_MESSAGES,
      MODALS_EVENTS
    });

    this.$rootScope.$on(this.MODALS_EVENTS.taskFirst, () => { this.closeModalInstance(); });
    this.$rootScope.$on(this.MODALS_EVENTS.taskSecond, () => { this.recalculateExistingTasks(); });

    this.$rootScope.$on(this.MODALS_EVENTS.eventFirst, () => { this.closeModalInstance(); });
    this.$rootScope.$on(this.MODALS_EVENTS.eventSecond, event => { console.log('second event fired', event); });
  }

  openModalForDecision(slotType) {
    let msg = (slotType === 'task') ? this.MODALS_TASK_MESSAGES : this.MODALS_EVENT_MESSAGES;

    this.ModalsService.getModalWindowOpen(msg);
  }

  closeModalInstance() {
    this.ModalsService.getModalWindowClose();
  }

  recalculateExistingTasks() {
    //needs to disable button when we don't have ability to shift existing tasks
    /*if (!this.abilityToShiftExistingSlots(true)) {
      return false;
    }*/

    //returns object with object with data and free slots
    //FIXME:
    this.getFreeSlots((new Date(Date.now())).toUTCString(), (new Date(Date.now() + 140000000)).toUTCString())
      .then(function(data) { console.log(data); });
    //figure out how to
  }

  abilityToShiftExistingSlots(abilityToShift) {
    //FIXME:
    return abilityToShift;
  }

  getFreeSlots(startDate, endDate) {
    return new Promise(resolve => {
      this.AlgorithmServer.get({
        q: 'free-time',
        start: startDate,
        end: endDate
      }, res => {
        resolve(res.data);
      });
    });
  }
}

angular.module('algorithm').service('AlgorithmNegative', AlgorithmNegative);

//TODO: get new task start/end date
