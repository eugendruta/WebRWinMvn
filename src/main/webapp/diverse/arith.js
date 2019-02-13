import {isNumber} from './values.js'

  export function add(a, b) {
    if (isNumber(a) && isNumber(b)) {
      return a + b;
    }
    return NaN;
  }