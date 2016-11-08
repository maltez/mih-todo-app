describe('mih.core.aside.conroller', () => {
  beforeEach(module('core'));
  let $controller;

  beforeEach(inject(_$controller_ =>  {
    $controller = _$controller_;
  }));
    it('Controller scope should have selectedTopState property equal NULL', () => {
      let $scope = {},
        controller = $controller('PasswordController', { $scope });
      http://plnkr.co/edit/zhh8jnXmwpdAuBbvBWYk?p=preview
      expect($scope.selectedTopState).toBe(null);
  });
});
