export class UrlParser {
    parse(url: string): object {
        type STATE = 'key' | 'value';

        let key = 'outlet';
        let value: string = '';
        let depth = 0;
        let state: STATE = null;
        let result: object = { };

        state = 'value';

        url += '\0';

        for (let i = 0; i < url.length; i++) {
            let c = url.substr(i, 1);
            let c2 = url.substr(i, 2);

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
                    else if (c2 === '//' ) {
                        result[key] = value;
                        key = value = '';
                        state = 'key';
                        i++;
                    }
                    else if ( c === '\0') {
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

    }
}