const R = require('ramda');
const parse = require('./src/parser');
const { defaultFormat } = require('./src/table-formatter');

const display = out => R.pipe(defaultFormat, out);
// eslint-disable-next-line no-console
const consoleDisplay = display(console.log);

const displayCronValues = (cronValues) => {
  const {
    minutes,
    hours,
    dayOfMonth,
    month,
    dayOfWeek,
    command,
  } = cronValues;

  const data = {
    minute: minutes,
    hour: hours,
    'day of month': dayOfMonth,
    month,
    'day of week': dayOfWeek,
    command,
  };

  consoleDisplay(data);
};

const parseInputAndDisplay = R.pipe(parse, displayCronValues);

const run = () => {
  const input = process.argv[2];
  parseInputAndDisplay(input);
};

run();
