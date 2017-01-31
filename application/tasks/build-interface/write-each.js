'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

let writeEach = (() => {
	var _ref = _asyncToGenerator(function* (input, targets) {
		let rewriter = arguments.length <= 2 || arguments[2] === undefined ? ident : arguments[2];

		const content = (0, _isStream2.default)(input) ? yield (0, _streamToString2.default)(input) : input;

		const jobs = targets.map((() => {
			var _ref2 = _asyncToGenerator(function* (target) {
				yield (0, _mkdirpPromise2.default)(_path2.default.dirname(target));
				return _fs2.default.writeFile(target, rewriter(content, target));
			});

			return function (_x4) {
				return _ref2.apply(this, arguments);
			};
		})());

		return Promise.all(jobs);
	});

	return function writeEach(_x, _x2) {
		return _ref.apply(this, arguments);
	};
})();

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _isStream = require('is-stream');

var _isStream2 = _interopRequireDefault(_isStream);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _streamToString = require('stream-to-string');

var _streamToString2 = _interopRequireDefault(_streamToString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = writeEach;

const ident = i => i;

module.exports = exports['default'];