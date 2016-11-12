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

  leftTimeBeforeDeadline(tasks) {
    return tasks.forEach(function(value, key) {
      tasks[key].leftEstimation = tasks[key].estimation - _.sum(tasks[key].slots.passedSlots.map(function(value) {
        return value.duration;
      }));

      tasks[key].leftHoursBeforeDeadline = parseInt(((new Date(tasks[key].days.endTime) - this.startDate) / (1000 * 60 * 60)).toFixed(1));
    }, this);
  }

  cc(data) {
    var tasks = data.tasks; //arr
    var slots = data.slots; //obj

    var concatSlots = {
      arrayOfPassedSlots: slots.passedSlots.map(function(value) { return value.taskId; }),
      arrayOfFutureSlots: slots.futureSlots.map(function(value) { return value.taskId; })
    };

    tasks.forEach(function(value, key) {
      tasks[key].slots = {
        passedSlots: [],
        futureSlots: []
      };

      var indexArrPassed = concatSlots.arrayOfPassedSlots.reduce(function(newArr, elem, index) {
        if (elem === value._id)
          newArr.push(index);
        return newArr;
      }, []);

      var indexArrFuture = concatSlots.arrayOfFutureSlots.reduce(function(newArr, elem, index) {
        if (elem === value._id)
          newArr.push(index);
        return newArr;
      }, []);

      indexArrPassed.forEach(function(index) { tasks[key].slots.passedSlots.push(slots.passedSlots[index]); });
      indexArrFuture.forEach(function(index) { tasks[key].slots.futureSlots.push(slots.futureSlots[index]); });
    });

    this.leftTimeBeforeDeadline(tasks);
  }
}

angular.module('algorithm').service('AlgorithmNegative', AlgorithmNegative);
