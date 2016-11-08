angular.module('modals')
  .value('taskMessages', {
    TYPE: 'TASK',
    WARNING_MSG: 'Not sufficient free time for a new task',
    MODAL_TITLE: 'Confirmation Window',
    BUTTONS_MSG: {
      FIRST_WAY: 'Increase deadline or reduce estimation',
      SECOND_WAY: 'Shift existing slots'
    }
  })
  .value('eventMessages', {
    TYPE: 'EVENT',
    WARNING_MSG: 'Do you want to leave existing tasks as is or shift them?',
    MODAL_TITLE: 'Confirmation Window',
    BUTTONS_MSG: {
      FIRST_WAY: 'Leave all tasks as is',
      SECOND_WAY: 'Shift conflicted tasks'
    }
  });
