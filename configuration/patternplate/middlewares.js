'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
const middlewares = {
	'path': ['application/middlewares', 'appliation/patternplate/middlewares'],
	'enabled': {
		'basicauth': {
			'enabled': false,
			'credentials': {
				'name': 'tvgui',
				'pass': 'tvgui'
			},
			'exclude': '/health'
		}
	}
};

exports.default = middlewares;
module.exports = exports['default'];