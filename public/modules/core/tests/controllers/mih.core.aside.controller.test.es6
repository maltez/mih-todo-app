describe('mih.core.aside.conroller', () => {
  let mihAsideCtrl;
  let $scope;

  // Load the main application module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
  // This allows us to inject a service but then attach it to a variable
  // with the same name as the service.
  beforeEach(inject(($controller, $rootScope, $state) => {
    $scope = $rootScope.$new();
    // Initialize the Authentication controller
    mihAsideCtrl = $controller('mihAsideCtrl', { $scope, $state });
  }));

  it('Controller scope should have selectedTopState NULL by default:', () => {
    expect(mihAsideCtrl.selectedTopState).toBe(null);
  });

  it('Controller have proper topStates:', () => {
    expect(Array.isArray(mihAsideCtrl.topState)).toBeTruthy();

    expect(mihAsideCtrl.topState[0]).toEqual(jasmine.objectContaining({
      name: 'todo_state'
    }));

    expect(mihAsideCtrl.topState[1]).toEqual(jasmine.objectContaining({
      name: 'overdue'
    }));

    expect(mihAsideCtrl.topState[2]).toEqual(jasmine.objectContaining({
      name: 'templates'
    }));
  });

  it('Changing state should return "false" if no state:', () => {
    expect(mihAsideCtrl.goToState()).toBeFalsy();
  });

  it('Changing state should return string value:', () => {
    expect(typeof mihAsideCtrl.goToState('overdue')).toBe('string');
  });

  it('Changing state should set selectedTopState:', () => {
    mihAsideCtrl.goToState('overdue');

    expect(mihAsideCtrl.selectedTopState).toBeTruthy();
  });
});
