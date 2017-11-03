'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fitToParent = require('./fitToParent');

var _fitToParent2 = _interopRequireDefault(_fitToParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// attach to lib if possible, default to global
var $ = window.jQuery || window.Zepto;
if ($) {
    $.fn.fitToParent = function (ops) {
        this.each(function () {
            (0, _fitToParent2.default)(_extends({ element: this }, ops));
            return this;
        });
    };
} else {
    window.fitToParent = _fitToParent2.default;
}