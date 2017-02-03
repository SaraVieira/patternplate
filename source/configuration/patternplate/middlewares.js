const middlewares = {
	'path': [
		'application/middlewares',
		'appliation/patternplate/middlewares'
	],
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

export default middlewares;
