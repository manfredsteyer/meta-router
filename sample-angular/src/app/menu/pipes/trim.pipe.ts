import { Pipe } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class Trim {
  transform(value) {
    return value.replace(/ /g, '');
  }
}
