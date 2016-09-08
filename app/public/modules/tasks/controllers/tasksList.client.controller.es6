'use strict';

class TasksListController {
	/** @ngInject */
	constructor($rootScope, Authentication, Tasks) {
		this.authentication = Authentication;
		this.tasks = Tasks.query();
		this.Tasks = Tasks;
		this.status = {};
		this.status.isComplete = false;

		$rootScope.$on('NEW_TASK_MODIFY', () => {
			this.find();
		});

		this.sortType = localStorage.getItem('sidebarTodoSortOrderBy') || 'days.endTime';
		this.sortReverse = localStorage.getItem('sidebarTodoSortOrderReverse') || false;
	}

	sortListBy(type) {
		localStorage.setItem('sidebarTodoSortOrderBy', type);
		localStorage.setItem('sidebarTodoSortOrderReverse', !this.sortReverse);
		this.sortType = type;
		this.sortReverse = !this.sortReverse;
	}

	find () {
		this.tasks = this.Tasks.query();
	}

	getTaskDonePercentage(task) {
		return +((task.progress * 100) / task.estimation).toFixed(2);
	}
}

angular.module('tasks').controller('TasksListController', TasksListController);
