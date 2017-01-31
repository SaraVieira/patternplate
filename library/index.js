'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let patternplate = (() => {
	var _ref = _asyncToGenerator(function* (args) {
		const options = (0, _lodash.merge)({}, defaults, args);
		const topLevel = (0, _lodash.omit)(options, Object.keys(defaults));
		const patterncwd = process.cwd();

		const patternplateSpecifics = { name: 'patternplate', cwd: (0, _findRoot2.default)(__dirname) };
		const patternplateOptions = (0, _lodash.merge)({}, topLevel, options.patternplate, patternplateSpecifics);
		const patternplate = yield (0, _boilerplateServer2.default)(patternplateOptions);

		const patternplateSeverSpecifics = { patterncwd: patterncwd };
		const patternplateServerOptions = (0, _lodash.merge)({}, topLevel, options.patternplateServer, topLevel, patternplateSeverSpecifics);
		const patternplateServerInstance = yield (0, _patternplateServer2.default)(patternplateServerOptions);

		const patternplateClientSpecifics = { env: options.patternplateClient.env || 'production' };
		const patternplateClientOptions = (0, _lodash.merge)({}, topLevel, options.patternplateServer, topLevel, patternplateClientSpecifics);
		const patternplateClientInstance = yield (0, _patternplateClient2.default)(patternplateClientOptions);

		patternplate.log.debug(`Running in mode ${patternplateServerInstance.runtime.mode}...`);

		if (patternplateServerInstance.runtime.mode === 'server') {
			patternplate.mount(patternplateClientInstance);
			patternplate.mount(patternplateServerInstance, '/tvg-ui/api');
			patternplateClientInstance.configuration.client.path = patternplateServerInstance.runtime.prefix;
			patternplateClientInstance.log.debug(`Changing patternplate-client.client.path to ${patternplateServerInstance.runtime.prefix}`);
		} else {
			patternplate.log.debug(`Skipping mounts, not in mode server.`);
		}

		patternplate.server = patternplateServerInstance;
		patternplate.client = patternplateClientInstance;

		patternplate.server.parent = patternplate;
		patternplate.client.parent = patternplate;
		return patternplate;
	});

	return function patternplate(_x) {
		return _ref.apply(this, arguments);
	};
})();

var _lodash = require('lodash');

var _findRoot = require('find-root');

var _findRoot2 = _interopRequireDefault(_findRoot);

var _boilerplateServer = require('boilerplate-server');

var _boilerplateServer2 = _interopRequireDefault(_boilerplateServer);

var _patternplateServer = require('patternplate-server');

var _patternplateServer2 = _interopRequireDefault(_patternplateServer);

var _patternplateClient = require('patternplate-client');

var _patternplateClient2 = _interopRequireDefault(_patternplateClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const defaults = {
	patternplateServer: {},
	patternplateClient: {},
	patternplate: {}
};

exports.default = patternplate;
module.exports = exports['default'];