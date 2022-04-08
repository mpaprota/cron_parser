const R = require('ramda');

const COMMA = ',';
const SLASH = '/';
const DASH = '-';
const ASTERISK = '*';
const CRON_OPERATORS = [COMMA, SLASH, DASH, ASTERISK];

const splitBetweenOperatorsAndValues = operators => (expr) => {
  const vs = [];
  const os = [];

  let tmp = '';
  expr.split('').forEach((v) => {
    if (operators.includes(v)) {
      os.push(v);

      if (tmp.length > 0) {
        vs.push(tmp);
        tmp = '';
      }
    } else {
      tmp += v;
    }
  });

  if (tmp.length > 0) {
    vs.push(tmp);
  }

  return {
    values: vs,
    operators: os,
  };
};

const splitBetweenCronOperatorsAndValues = splitBetweenOperatorsAndValues(CRON_OPERATORS);

const getCronOperatorsAndValues = R.pipe(
  splitBetweenCronOperatorsAndValues,
  R.evolve({
    values: R.map(Number),
  }),
);

const isNotAnArray = R.complement(R.is(Array));
const lt = (a, b) => a - b;
const sortAsc = R.sort(lt);
const inclusiveRange = (a, b) => R.range(a, b + 1);
const makeFlatUniqueSortedAsc = R.pipe(R.flatten, R.uniq, sortAsc);
const toStack = values => [...values].reverse();
const notEmpty = R.complement(R.isEmpty);

/**
 * Uses modified version of postfix notation where parameters for a command are stated before that command.
 * Parameters and commands are on separate stacks.
 * For example, postfix notation would be written 2,3,- instead of 2-3.
*/
const getCronTimes = (min, max, operatorsStack, valuesStack) => {
  const result = [];

  while (notEmpty(operatorsStack)) {
    const operator = operatorsStack.pop();

    switch (operator) {
      case DASH: {
        const a = valuesStack.pop();
        const b = valuesStack.pop();

        valuesStack.push(inclusiveRange(a, b));
        break;
      }
      case COMMA: {
        const v = valuesStack.pop();
        result.push(v);

        break;
      }
      case ASTERISK: {
        valuesStack.push(max);
        valuesStack.push(min);

        operatorsStack.push('-');

        break;
      }
      case SLASH: {
        let vs = valuesStack.pop();
        if (isNotAnArray(vs)) {
          vs = inclusiveRange(vs, max);
        }

        const b = valuesStack.pop();

        const filtered = vs.filter(v => v % b === 0);
        valuesStack.push(filtered);

        break;
      }
      default: {
        throw new Error(`Unrecognized operator ${operator}.`);
      }
    }
  }

  result.push(valuesStack);

  return makeFlatUniqueSortedAsc(result);
};

const parseField = (min, max) => (expr) => {
  const operatorsAndValues = getCronOperatorsAndValues(expr);
  const { values, operators } = operatorsAndValues;

  const valuesStack = toStack(values);
  const operatorsStack = toStack(operators);

  return getCronTimes(min, max, operatorsStack, valuesStack);
};

const parseMinute = parseField(0, 59);
const parseHour = parseField(0, 23);
const parseDayOfMonth = parseField(1, 31);
const parseMonth = parseField(1, 12);
const parseDayOfWeek = parseField(0, 6);

const parse = (str) => {
  const [
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
    command,
  ] = str.split(' ');

  return {
    minutes: parseMinute(minute),
    hours: parseHour(hour),
    dayOfMonth: parseDayOfMonth(dayOfMonth),
    month: parseMonth(month),
    dayOfWeek: parseDayOfWeek(dayOfWeek),
    command,
  };
};

module.exports = parse;
module.exports.parseField = parseField;
