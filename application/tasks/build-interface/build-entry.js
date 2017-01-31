'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let buildEntry = (() => {
	var _ref = _asyncToGenerator(function* (url, target, context) {
		const app = context.app;
		const rewriter = context.rewriter;

		const indexPath = _path2.default.resolve(target, 'index.html');
		const htaccessPath = _path2.default.resolve(target, '.htaccess');
		const notFoundPath = _path2.default.resolve(target, '404.html');
		const renderFilters = { flags: context.flags };

		const index = yield renderPage(app, url, renderFilters);

		yield (0, _mkdirpPromise2.default)(target);
		yield _fs2.default.writeFile(indexPath, rewriter(index, indexPath));

		// Place a copy of index at 404.html
		const notFound = yield renderPage(app, url, renderFilters);
		yield _fs2.default.writeFile(notFoundPath, rewriter(notFound, notFoundPath));

		const htaccess = `
		ErrorDocument 404 404.html
	`.replace(/\t/g, '');

		// Write a template .htaccess
		yield _fs2.default.writeFile(htaccessPath, htaccess);
		return;
	});

	return function buildEntry(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _clientRequire = require('./client-require');

var _clientRequire2 = _interopRequireDefault(_clientRequire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const renderPage = (0, _clientRequire2.default)('render-page');

exports.default = buildEntry;
module.exports = exports['default'];