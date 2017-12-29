import { UrlParser } from './url-parser';

describe('UrlParser', () => {

    let urlParser: UrlParser;

    beforeEach(() => {
        urlParser = new UrlParser();
    });

    it('parses x/y/z', () => {
        const url = 'x/y/z';
        let result = urlParser.parse(url);
        expect(result['outlet']).toBe(url);
    });

    it('parses x/y/z(a:1//b:2)', () => {
        const url = 'x/y/z(a:1//b:2)';
        let result = urlParser.parse(url);
        expect(result['outlet']).toBe(url);
    });

    it('parses x/y/z;outlet2=a/b/c', () => {
        const url = 'x/y/z;outlet2=a/b/c';
        let result = urlParser.parse(url);
        expect(result['outlet']).toBe('x/y/z');
        expect(result['outlet2']).toBe('a/b/c');

    });

    it('parses x/y/z(a:1//b:2);outlet2=a/b/c(a:4//b:5)', () => {
        const url = 'x/y/z(a:1//b:2);outlet2=a/b/c(a:4//b:5)';
        let result = urlParser.parse(url);
        expect(result['outlet']).toBe('x/y/z(a:1//b:2)');
        expect(result['outlet2']).toBe('a/b/c(a:4//b:5)');

    });

    it('parses x/y/z;outlet2=a/b/c;outlet3=q/e/r/t/y', () => {

    });

    it('parses outlet7=x/y/z;outlet2=a/b/c;outlet3=q/e/r/t/y', () => {

    });

    it('parses outlet7=x/y/z(a:1//b:2);outlet2=a/b/c(a:4//b:5)', () => {

    });

})