'use strict';

class SettingsController {
	constructor($location, Users, Authentication, $timeout, $window, FileUploader, MIHUtils, $rootScope) {
		if (!Authentication.user) $location.path('/');

		/*@ngInject*/
		this.Users = Users;
		this.user = Authentication.user;
		this.$timeout = $timeout;
		this.$window = $window;
		this.FileUploader = FileUploader;
		this.imageURL = this.user.profileImageURL;
		// TODO: move to root controller + share
		// TODO: refactor into directive so that we do not need to always inject it
		this.MIHUtils = MIHUtils;
		this.$rootScope = $rootScope;

		/*fields*/
		this.workingDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

		this.initFileUploader();
	}

	initFileUploader() {
		var onAfterAddingFile = (fileItem) => {
			if (this.$window.FileReader) {
				var fileReader = new this.$window.FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = (fileReaderEvent) => {
					this.$timeout(() => {
						this.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		var onSuccessItem = (fileItem, response, status, headers) => {
			this.success = true;
			this.user = this.user = response;
			this.cancelUpload();
		};

		var onErrorItem = (fileItem, response, status, headers) => {
			this.cancelUpload();
			this.error = response.message;
		};

		this.uploader = new this.FileUploader({
			url: 'users/picture',
			alias: 'newProfilePicture',
			onAfterAddingFile: onAfterAddingFile,
			onSuccessItem: onSuccessItem,
			onErrorItem: onErrorItem
		});

		// Set file uploader image filter
		this.uploader.filters.push({
			name: 'imageFilter',
			fn (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});
	}

	addNewBookedSlot() {
		this.user.predefinedSettings.booked.push({
			startTime: '14:00',
			endTime: '15:00'
		});
	}

	removeBookedSlot(index) {
		this.user.predefinedSettings.booked.splice(index, 1);
	}

	updateUserProfile(isValid) {
		if (isValid) {
			this.success = this.error = null;
			var user = new this.Users(this.user);

			user.$update(response => {
				this.success = true;
				this.user = response;
				this.$rootScope.$broadcast('updateUserInfo', this.user);
			}, response => {
				this.error = response.data.message;
			});
		} else {
			this.submitted = true;
		}
	}

	uploadProfilePicture() {
		this.success = this.error = null;
		this.uploader.uploadAll();
	}

	cancelUpload() {
		this.uploader.clearQueue();
		this.imageURL = this.user.profileImageURL;
	}
}

angular.module('users').controller('SettingsController', SettingsController);
