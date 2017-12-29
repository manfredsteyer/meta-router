"use strict";
exports.__esModule = true;
var url_parser_1 = require("./url-parser");
describe('UrlParser', function () {
    var urlParser;
    beforeEach(function () {
        urlParser = new url_parser_1.UrlParser();
    });
    it('parses x/y/z', function () {
        var url = 'x/y/z';
        var result = urlParser.parse(url);
        expect(result['outlet']).toBe(url);
    });
    it('parses x/y/z(a:1//b:2)', function () {
        var url = 'x/y/z(a:1//b:2)';
        var result = urlParser.parse(url);
        expect(result['outlet']).toBe(url);
    });
    it('parses x/y/z;outlet2=a/b/c', function () {
        var url = 'x/y/z;outlet2=a/b/c';
        var result = urlParser.parse(url);
        expect(result['outlet']).toBe('x/y/z');
        expect(result['outlet2']).toBe('a/b/c');
    });
    it('parses x/y/z(a:1//b:2);outlet2=a/b/c(a:4//b:5)', function () {
        var url = 'x/y/z(a:1//b:2);outlet2=a/b/c(a:4//b:5)';
        var result = urlParser.parse(url);
        expect(result['outlet']).toBe('x/y/z(a:1//b:2)');
        expect(result['outlet2']).toBe('a/b/c(a:4//b:5)');
    });
    it('parses x/y/z;outlet2=a/b/c;outlet3=q/e/r/t/y', function () {
    });
    it('parses outlet7=x/y/z;outlet2=a/b/c;outlet3=q/e/r/t/y', function () {
    });
    it('parses outlet7=x/y/z(a:1//b:2);outlet2=a/b/c(a:4//b:5)', function () {
    });
});
