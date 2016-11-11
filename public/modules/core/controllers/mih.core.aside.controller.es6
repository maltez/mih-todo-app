class mihAsideCtrl {
  constructor($scope, $state) {
    this.$state = $state;
    this.selectedTopState =  null;
    this.topState = [
      $state.get('todo_state'),
      $state.get('overdue'),
      $state.get('templates')
    ];

    const stateChangeHandler = () => {
      const displayedTopState = _.find(this.topState, parentState => $state.includes(parentState.name));

      if (displayedTopState) {
        this.selectedTopState = displayedTopState;
      }
    };

    $scope.$on('$stateChangeSuccess', stateChangeHandler);
  }

  goToState(newState) {
    if (!newState) {
      return false;
    }
    this.$state.go(newState);

    return newState;
  }
}

mihAsideCtrl.$inject = ['$scope', '$state'];

angular
  .module('core')
  .controller('mihAsideCtrl', mihAsideCtrl);
