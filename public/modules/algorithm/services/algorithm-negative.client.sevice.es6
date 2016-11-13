class AlgorithmNegative {

  /** @ngInject */
  constructor($rootScope, Slots, $timeout, ModalsService, MODALS_TASK_MESSAGES, MODALS_EVENT_MESSAGES, MODALS_EVENTS) {
    Object.assign(this, {
      $rootScope,
      Slots,
      $timeout,
      ModalsService,
      MODALS_TASK_MESSAGES,
      MODALS_EVENT_MESSAGES,
      MODALS_EVENTS
    });

    this.slotTypes = {
      task : 'task',
      event: 'event'
    };
  }

  initialize(slotType, totalAvailTime) {
    let additionalMsg = `(you need to free up ${this.estimation - totalAvailTime} h)`;
    this.openModalForDecision(slotType, additionalMsg);

    this.totalAvailHours = totalAvailTime;
    this.$rootScope.$on(this.MODALS_EVENTS.taskFirst, () => { this.closeModalInstance(); });
    this.$rootScope.$on(this.MODALS_EVENTS.taskSecond, () => { this.getOccupiedSlots(this.startDate, this.endDate); });

    //this.$rootScope.$on(this.MODALS_EVENTS.eventFirst, () => { this.closeModalInstance();  });
    //this.$rootScope.$on(this.MODALS_EVENTS.eventSecond, event => { console.log('second event fired', event); });
  }

  getSlots(startDate, endDate, type) {
    return this.delegate.AlgorithmServer.get({
      q: type,
      start: startDate,
      end: endDate
    }).$promise;
  }

  getOccupiedSlots(startDate, endDate) {
    return new Promise(resolve => {
      this.getSlots(startDate, endDate, 'occupied-time')
        .then(res => {
          this.slotsOccupiedSlots = {
            slots: res.slots,
            tasks: res.tasks
          };

	      resolve(this.slotsOccupiedSlots);

          let aggregatedTasksWithSlots = this.aggregateTasksWithSlots(this.slotsOccupiedSlots);
          let tasksWithLeftTimeData = this.leftTimeBeforeDeadline(aggregatedTasksWithSlots);

          this.tasksWithShiftAbilities = this.checkShiftAbilities(tasksWithLeftTimeData);
	      //TODO: check posibility to shift tasks for days before deadline (get days free time before deadline)
	      this.recalculateExistingTasks(this.tasksWithShiftAbilities);
        });
    });
  }

  //TODO: how to decrease quantity of requests?
  recalculateExistingTasks(tasks) {
	  let freeSlots = [];

	  return new Promise(resolve => {
		  tasks.forEach(function(value, key) {
			  this.getSlots(new Date(this.startDate.setDate(this.startDate.getDate() + 1)), value.days.endTime, 'free-time')
				  .then(res => {
					  this.slots = res.data;
					  freeSlots.push(this.slots);
					  resolve(this.slots);
				  });
		  }, this);
	  }).then(() => {
		  this.$timeout(() => {
			  console.log(freeSlots);
			  this.findAppropriateSlotsToShift(tasks, freeSlots);
		  });
		});
  }

	findAppropriateSlotsToShift(tasksToShift, freeSlots) {
		let hoursToFree = this.estimation - this.totalAvailHours;

		tasksToShift.forEach(function(value, key) {
			while (hoursToFree > 0) {
				value.slots.futureSlots.forEach(function(v, index) {
					let slotDuration = v.duration;
					let freePlaces = freeSlots[key];

					Object.keys(freePlaces).forEach(function(ky, ind) {
						freePlaces[ky].forEach(function(val, k) {
							if (val.duration >= slotDuration) {
								hoursToFree -= slotDuration;

								value.slots.futureSlots[index].start = val.start;
								value.slots.futureSlots[index].end = new Date(new Date(val.start).setHours(new Date(val.start).getHours() + 3)).toISOString();

								this.Slots.update(value.slots.futureSlots[index]);
							}
						}, this);
					}, this);
				}, this);
			}
		}, this);
	}

	// returnRecommendations() {
	// 	let suitableSlots = [];
	//
	// 	suitableSlots.push({
	// 		duration: this.estimation,
	// 		priority: this.priority,
	// 		end: this.endDate.getTime(),
	// 		start: this.startDate.getTime()
	// 	});
	//
	// 	return suitableSlots;
	// }

  leftTimeBeforeDeadline(tasks) {
    tasks.forEach((value, key) => {
      tasks[key].leftEstimation = tasks[key].estimation - _.sum(tasks[key].slots.passedSlots.map(value => {
        return value.duration;
      }));

    //FIXME: get only working hours
      tasks[key].leftHoursBeforeDeadline = parseInt(((new Date(tasks[key].days.endTime) - this.startDate) / (1000 * 60 * 60)).toFixed(1));
    }, this);

    return tasks;
  }
  checkShiftAbilities(tasks) {
    let filteredTasks = [];

    tasks.forEach((value, key) => {
      tasks[key].canShiftWithinDeadline = (tasks[key].leftHoursBeforeDeadline - tasks[key].leftEstimation >= 0);
    });

    tasks.some(value => {
      if (value.canShiftWithinDeadline >= 0) {
        filteredTasks.push(value);
      }
    });

    return filteredTasks;
  }
  aggregateTasksWithSlots(data) {
    var tasks = data.tasks; //arr
    var slots = data.slots; //obj

    var concatSlots = {
      arrayOfPassedSlots: slots.passedSlots.map(value => { return value.taskId; }),
      arrayOfFutureSlots: slots.futureSlots.map(value => { return value.taskId; })
    };

    tasks.forEach((value, key) => {
      tasks[key].slots = {
        passedSlots: [],
        futureSlots: []
      };

      var indexArrPassed = concatSlots.arrayOfPassedSlots.reduce((newArr, elem, index) => {
        if (elem === value._id)
          newArr.push(index);
        return newArr;
      }, []);

      var indexArrFuture = concatSlots.arrayOfFutureSlots.reduce((newArr, elem, index) => {
        if (elem === value._id)
          newArr.push(index);
        return newArr;
      }, []);

      indexArrPassed.forEach(index => { tasks[key].slots.passedSlots.push(slots.passedSlots[index]); });
      indexArrFuture.forEach(index => { tasks[key].slots.futureSlots.push(slots.futureSlots[index]); });
    });

    return tasks;
  }
  openModalForDecision(slotType, additionalData) {
    let msg = (slotType === this.slotTypes.task) ? this.MODALS_TASK_MESSAGES : this.MODALS_EVENT_MESSAGES;

    msg.timeToFree = additionalData;
    this.ModalsService.getModalWindowOpen(msg);
  }
  closeModalInstance() {
    this.ModalsService.getModalWindowClose();
  }
}

angular.module('algorithm').service('AlgorithmNegative', AlgorithmNegative);
