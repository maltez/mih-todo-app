class TemplatesService {
	getById(user, id, type) {
		return user[type].find(template => template._id == id);
	}

	getLastUsed(user) {
		//TODO: replace with real logic, after adding lastUsingDate field to template Class
		if (user['taskTemplates'][0]) {
			return {
				type: 'taskTemplates',
				data: user['taskTemplates'][0]
			}
		} else {
			return {
				type: 'eventTemplates',
				data: user['eventTemplates'][0]
			}
		}
	}
}

angular.module('templates').service('TemplatesService', TemplatesService);
