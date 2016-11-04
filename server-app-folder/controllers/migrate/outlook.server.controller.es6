'use strict';

const config = require('../../../config/config').outlook;

const {clientID, clientSecret, site, authorizationPath, tokenPath} = config;

const CREDENTIALS = {
	clientID,
	clientSecret,
	site,
	authorizationPath,
	tokenPath
};

const ERRORS = {
	getData: {
		auth: 'Sync called while not logged in',
		dateRange: 'Sync called while not logged in'
	}
};

const outlook = require('node-outlook');
const oauth2 = require('simple-oauth2')(CREDENTIALS);

function getEmailFromIdToken(id_token) {
	const token_parts = id_token.split('.');
	const encoded_token = new Buffer(token_parts[1].replace('-', '+').replace('_', '/'), 'base64');
	const decoded_token = encoded_token.toString();
	const jwt = JSON.parse(decoded_token);

	return jwt.preferred_username
}

module.exports = {
	getAuthUrl: (req, res) => {
		const url = oauth2.authCode.authorizeURL({
			redirect_uri: config.serverRedirectUrl,
			scope: config.calendarScopes.join(' ')
		});

		res.json({url: url});
	},

	getTokenFromCode: (req, res) => {
		const auth_code = req.query.code;

		if (!auth_code) {
			console.log('authorize called without a code parameter, redirecting to login');
			return res.redirect(config.uiRedirectUrl);
		}

		oauth2.authCode.getToken({
			code: auth_code,
			redirect_uri: config.serverRedirectUrl,
			scope: config.calendarScopes.join(' ')
		}, (error, result) => {
			if (error) {
				console.log('Access token error: ', error.message);
				return res.redirect(config.uiRedirectUrl);
			}

			const token = oauth2.accessToken.create(result);
			const email = getEmailFromIdToken(token.token.id_token);

			res.cookie('outlook_email', email, {maxAge: config.cookieMaxAge});
			res.cookie('outlook_access_token', token.token.access_token, {maxAge: config.cookieMaxAge});
			res.redirect(config.uiRedirectUrl);
		});
	},

	getCalendarEvents: (req, res) => {
		let {token, email, startDateTime, endDateTime} = req.query;

		if (!token || !email) {
			return res.status(400).send({
				message: ERRORS.getData.auth
			});
		} else if (!startDateTime || !endDateTime) {
			return res.status(400).send({
				message: ERRORS.getData.dateRange
			});
		}

		startDateTime = new Date(startDateTime);
		endDateTime = new Date(endDateTime);

		startDateTime.setHours(0, 0, 0, 0);
		endDateTime.setHours(23, 59, 0, 0);

		outlook.base.setApiEndpoint(config.apiEndpoint);
		outlook.base.setAnchorMailbox(email);

		const requestUrl = outlook.base.apiEndpoint() + config.calendarUrl;
		const params = {
			startDateTime,
			endDateTime
		};
		const headers = {
			Prefer: config.headers
		};
		const apiOptions = {
			url: requestUrl,
			token: token,
			headers: headers,
			query: params
		};

		outlook.base.makeApiCall(apiOptions, (error, response) => {
			if (error || response.statusCode !== 200) {
				return res.status(400).send({
					message: error || `Status code: ${response.statusCode}`
				});
			}

			res.json(response.body.value);
		});
	}
};
