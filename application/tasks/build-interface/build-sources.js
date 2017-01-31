'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _zenObservable = require('zen-observable');

var _zenObservable2 = _interopRequireDefault(_zenObservable);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

var _getTargets = require('./get-targets');

var _getTargets2 = _interopRequireDefault(_getTargets);

var _getSourceSets = require('./get-source-sets');

var _getSourceSets2 = _interopRequireDefault(_getSourceSets);

var _writeEach = require('./write-each');

var _writeEach2 = _interopRequireDefault(_writeEach);

var _serverRequire = require('./server-require');

var _serverRequire2 = _interopRequireDefault(_serverRequire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getPatternSource = (0, _serverRequire2.default)('get-pattern-source');
const urlQuery = (0, _serverRequire2.default)('utilities/url-query');

exports.default = buildSources;


function buildSources(datasets, target, context) {
	return new _zenObservable2.default(observer => {
		const app = context.app;
		const rewriter = context.rewriter;

		const sourceSets = (0, _getSourceSets2.default)(datasets);
		const getSource = getPatternSource(app);

		(0, _build2.default)(sourceSets, {
			read: function read(set) {
				return _asyncToGenerator(function* () {
					observer.next(set.file.id);
					return getSource(set.file.id, set.type, set.env);
				})();
			},
			write: function write(source, set) {
				return _asyncToGenerator(function* () {
					const typePath = urlQuery.format({
						pathname: '',
						query: { type: set.type }
					});
					const baseName = _path2.default.basename(set.file.id);
					const dirName = _path2.default.dirname(set.file.id);
					const base = _path2.default.resolve(target, dirName, typePath);
					return (0, _writeEach2.default)(source.body, (0, _getTargets2.default)(base, baseName, set), rewriter);
				})();
			},
			done: function done() {
				observer.complete();
			}
		}).catch(err => observer.error(err));
	});
}
module.exports = exports['default'];