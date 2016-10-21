'use strict';

class SettingsController {
	static get $inject() {
		return ['$injector'];
	}
	constructor($injector) {
		this.Authentication = $injector.get('Authentication');
		this.$location = $injector.get('$location');
		if (!this.Authentication.user) this.$location.path('/');

		/*@ngInject*/
		this.Users = $injector.get('Users');
		this.user = this.Authentication.user;
		this.imageURL = this.user.profileImageURL;
		this.$timeout = $injector.get('$timeout');
		this.$window = $injector.get('$window');
		this.FileUploader = $injector.get('FileUploader');
		// TODO: move to root controller + share
		// TODO: refactor into directive so that we do not need to always inject it
		this.MIHUtils = $injector.get('MIHUtils');
		this.$rootScope = $injector.get('$rootScope');
		this.Notification = $injector.get('Notification');

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
			this.Notification.success('file upload Success');
			angular.extend(this.user, response);
			this.cancelUpload();
		};

		var onErrorItem = (fileItem, response, status, headers) => {
			this.cancelUpload();
			this.Notification.error(response.message);
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
			var user = new this.Users(this.user);

			user.$update(response => {
				this.Notification.success(`Profile Saved Successfully`);
				this.user = response;
				this.$rootScope.$broadcast('updateUserInfo', this.user);
			}, response => {
				this.Notification.error(`Error: ${response.data.message}. Please try again later`);
			});
		} else {
			this.submitted = true;
		}
	}

	uploadProfilePicture() {
		this.uploader.uploadAll();
	}

	cancelUpload() {
		this.uploader.clearQueue();
		this.imageURL = this.user.profileImageURL;
	}
}

angular.module('users').controller('SettingsController', SettingsController);
