'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fp = require('lodash/fp');

var _zenObservable = require('zen-observable');

var _zenObservable2 = _interopRequireDefault(_zenObservable);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

var _getEnvSets = require('./get-env-sets');

var _getEnvSets2 = _interopRequireDefault(_getEnvSets);

var _getTargets = require('./get-targets');

var _getTargets2 = _interopRequireDefault(_getTargets);

var _writeEach = require('./write-each');

var _writeEach2 = _interopRequireDefault(_writeEach);

var _serverRequire = require('./server-require');

var _serverRequire2 = _interopRequireDefault(_serverRequire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getPatternDemo = (0, _serverRequire2.default)('get-pattern-demo');

exports.default = buildDemos;


function buildDemos(datasets, target, context) {
	return new _zenObservable2.default(observer => {
		const app = context.app;
		const rewriter = context.rewriter;


		const envs = (0, _getEnvSets2.default)(datasets);
		const idPad = (0, _fp.padEnd)((0, _fp.max)(envs.map(env => env.id.length)));

		(0, _build2.default)(envs, {
			read: function read(set, sets, count) {
				return _asyncToGenerator(function* () {
					observer.next(`${idPad(set.id)} ${count}/${envs.length}`);
					return yield getPatternDemo(app, set.id, { environments: set.env }, set.env);
				})();
			},
			write: function write(demo, set, sets, count) {
				return _asyncToGenerator(function* () {
					observer.next(`${idPad(set.id)} ${count}/${envs.length}`);
					const base = _path2.default.resolve.apply(_path2.default, [target].concat(_toConsumableArray(set.relative)));
					const baseName = set.name;
					(0, _writeEach2.default)(demo, (0, _getTargets2.default)(base, baseName, set), rewriter);
				})();
			},
			done: function done() {
				observer.next(`${envs.length}/${envs.length}`);
				observer.complete();
			}
		}).catch(err => observer.error(err));
	});
}
module.exports = exports['default'];