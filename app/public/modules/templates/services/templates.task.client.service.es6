class TemplatesService {
	getById(user, id, type) {
		return user[type].find(template => template._id == id);
	}

	getLastUsed(templateType, user) {
		return user[templateType].sort((current, next) => current.lastUsingDate < next.lastUsingDate)[0] || {};
	}
}

angular.module('templates').service('TemplatesService', TemplatesService);
