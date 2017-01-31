'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

/**
 * Create a static build of a patternplate instance ready to be deployed on a static web server
 * @param {Object} application
 * @param {Object} configuration
 * @return {Promise<void>}
 */
let buildInterface = (() => {
	var _ref = _asyncToGenerator(function* (application, configuration) {
		const settings = (0, _lodash.merge)({}, defaults, configuration);
		const targetPath = _path2.default.resolve(process.cwd(), settings.target);
		const patternsPath = _path2.default.resolve(process.cwd(), './patterns');

		const app = application.parent;
		const client = application.parent.client;
		const server = application.parent.server;

		// const release = trap(application);
		const automount = selectAutoMount(server);

		const environments = yield getEnvironments(patternsPath, {
			cache: server.cache
		});

		const flags = settings.flags || [];
		const filterPatternData = flags.length > 0 ? function (i) {
			return flags.includes(i.manifest.flag);
		} : function () {
			return true;
		};

		const jobMax = 1 + (0, _fp.max)(jobPrefixes.map(function (i) {
			return i.length;
		}));
		const jobPad = (0, _fp.padEnd)(jobMax);

		const rewriter = yield (0, _getRewriter2.default)(targetPath);
		const serverContext = { app: server, automount: automount, rewriter: rewriter, jobPad: jobPad, flags: flags };
		const clientContext = { app: client, rewriter: rewriter, jobPad: jobPad, flags: flags };

		const apiTargetPath = _path2.default.resolve(targetPath, 'api', 'pattern');
		const patternTargetPath = _path2.default.resolve(targetPath, 'pattern');
		const demoTargetPath = _path2.default.resolve(targetPath, 'demo');

		const dataStream = (0, _getPatternDatasets2.default)(app, client, server);
		const rawPatternData = [];

		const dataTask = new _listr2.default([{
			title: 'Pattern data',
			task: function task() {
				return dataStream.map(d => {
					if (d.data) {
						rawPatternData.push(d.data);
					}
					return d;
				}).map(d => d.message).filter(Boolean);
			}
		}]);

		yield dataTask.run();

		const patternData = rawPatternData.filter(filterPatternData).map(function (p) {
			p.environmentNames = environments.filter(function (env) {
				return env.display !== false;
			}).map(function (env) {
				return env.name;
			});
			return p;
		});

		const release = (0, _trap2.default)(app);

		const tasks = new _listr2.default([{
			title: 'Entry files',
			task: function task() {
				return (0, _buildEntry2.default)('/', targetPath, clientContext);
			}
		}, {
			title: 'Static files',
			task: function task() {
				return (0, _buildStatics2.default)('patternplate-client', targetPath, serverContext);
			}
		}, {
			title: 'Page files',
			task: function task() {
				return (0, _buildPages2.default)(patternData, patternTargetPath, clientContext);
			}
		}, {
			title: 'Automount components',
			task: function task() {
				return (0, _buildComponents2.default)(patternData, demoTargetPath, serverContext);
			}
		}, {
			title: 'Demos',
			task: function task() {
				return (0, _buildDemos2.default)(patternData, demoTargetPath, serverContext);
			}
		}, {
			title: 'Data',
			task: function task() {
				return (0, _buildData2.default)(patternData, apiTargetPath, serverContext);
			}
		}, {
			title: 'Demo Files',
			task: function task() {
				return _zenObservable2.default.from(patternData).flatMap(data => (0, _buildDemoFiles2.default)(data, demoTargetPath, serverContext));
			}
		}, {
			title: 'Sources',
			task: function task() {
				const fileTargetPath = _path2.default.resolve(targetPath, 'api', 'file');
				return _zenObservable2.default.from(patternData).flatMap(data => (0, _buildSources2.default)([data], fileTargetPath, serverContext));
			}
		}], { concurrent: true });

		yield tasks.run();
		release(function (m) {
			return m.forEach(function (message) {
				return console.log(message);
			});
		});
	});

	return function buildInterface(_x, _x2) {
		return _ref.apply(this, arguments);
	};
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _fp = require('lodash/fp');

var _listr = require('listr');

var _listr2 = _interopRequireDefault(_listr);

var _zenObservable = require('zen-observable');

var _zenObservable2 = _interopRequireDefault(_zenObservable);

var _buildComponents = require('./build-components');

var _buildComponents2 = _interopRequireDefault(_buildComponents);

var _buildData = require('./build-data');

var _buildData2 = _interopRequireDefault(_buildData);

var _buildDemoFiles = require('./build-demo-files');

var _buildDemoFiles2 = _interopRequireDefault(_buildDemoFiles);

var _buildDemos = require('./build-demos');

var _buildDemos2 = _interopRequireDefault(_buildDemos);

var _buildEntry = require('./build-entry');

var _buildEntry2 = _interopRequireDefault(_buildEntry);

var _buildPages = require('./build-pages');

var _buildPages2 = _interopRequireDefault(_buildPages);

var _buildSources = require('./build-sources');

var _buildSources2 = _interopRequireDefault(_buildSources);

var _buildStatics = require('./build-statics');

var _buildStatics2 = _interopRequireDefault(_buildStatics);

var _getPatternDatasets = require('./get-pattern-datasets');

var _getPatternDatasets2 = _interopRequireDefault(_getPatternDatasets);

var _getRewriter = require('./get-rewriter');

var _getRewriter2 = _interopRequireDefault(_getRewriter);

var _serverRequire = require('./server-require');

var _serverRequire2 = _interopRequireDefault(_serverRequire);

var _trap = require('./trap');

var _trap2 = _interopRequireDefault(_trap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getEnvironments = (0, _serverRequire2.default)('get-environments');

const defaults = {
	target: 'build/build-interface'
};

const jobPrefixes = ['read', 'render entry', 'write entry', 'entry', 'pages', 'data', 'demo', 'demo files', 'source'];

const selectAutoMount = (0, _fp.get)('configuration.transforms.react-to-markup.opts.automount');

exports.default = buildInterface;
module.exports = exports['default'];