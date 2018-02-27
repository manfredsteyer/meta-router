"use strict";
exports.__esModule = true;
var UrlParser = /** @class */ (function () {
    function UrlParser() {
    }
    UrlParser.prototype.parse = function (url) {
        var key = 'outlet';
        var value = '';
        var depth = 0;
        var state = null;
        var result = {};
        state = 'value';
        url += '\0';
        for (var i = 0; i < url.length; i++) {
            var c = url.substr(i, 1);
            var c2 = url.substr(i, 2);
            switch (state) {
                case 'key':
                    if (c === ':') {
                        state = 'value';
                    }
                    else {
                        key += c;
                    }
                    break;
                case 'value':
                    if (c === '(') {
                        value += c;
                        depth += 1;
                    }
                    else if (c === ')') {
                        value += c;
                        depth -= 1;
                    }
                    else if (depth > 0) {
                        value += c;
                    }
                    else if (c2 === '//') {
                        result[key] = value;
                        key = value = '';
                        state = 'key';
                        i++;
                    }
                    else if (c === '\0') {
                        result[key] = value;
                        key = value = '';
                        state = 'key';
                    }
                    else if (c === ':') {
                        key = value;
                        value = '';
                        state = 'value';
                    }
                    else {
                        value += c;
                    }
                    break;
            }
        }
        return result;
    };
    return UrlParser;
}());
exports.UrlParser = UrlParser;
