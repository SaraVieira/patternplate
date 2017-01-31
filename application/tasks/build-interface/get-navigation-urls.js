'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

exports.default = getNavigationUrls;


function getNavigationUrls(tree) {
	return Object.values(tree || {}).reduce((pool, item) => {
		const fragments = item.id.split('/');
		const baseName = fragments[fragments.length - 1];
		const relative = fragments.slice(0, fragments.length - 1);

		const children = getNavigationUrls(item.children);
		return [].concat(_toConsumableArray(pool), [{
			id: item.id,
			type: item.type,
			relative: relative,
			baseName: baseName,
			name: `${baseName}/index.html`
		}], _toConsumableArray(children));
	}, []);
}
module.exports = exports['default'];