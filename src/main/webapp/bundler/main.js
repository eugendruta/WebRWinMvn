import {add} from 'ramda';

const name = (n) => 'hello' + n;

document.querySelector('#result')
  .textContent = '2 + 2 = ' + add(2, 2) + name('AJ');