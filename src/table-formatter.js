const R = require('ramda');

const DEFAULT_PADDING = 3;
const getLongestString = vs => vs.reduce((res, v) => (v.length > res.length ? v : res), '');
const getLongestKey = R.pipe(Object.keys, getLongestString);
const getLongestKeyLength = R.pipe(getLongestKey, R.length);

const padEndWithSpace = length => v => v.padEnd(length, ' ');
const spacer = R.join(' ');
const formatValue = R.cond([
  [R.is(String), R.identity],
  [R.is(Array), R.pipe(R.map(R.toString), spacer)],
  [R.T, R.toString],
]);

const joinEntry = (keyMapper, valueMapper) => (e) => {
  const key = e[0];
  const value = e[1];

  const paddedKey = keyMapper(key);
  const formattedValue = valueMapper(value);

  return `${paddedKey}${formattedValue}`;
};

const format = (padding, obj) => {
  const longestKeyLength = getLongestKeyLength(obj);
  const keyPadding = padEndWithSpace(longestKeyLength + padding);
  const formattedEntry = joinEntry(keyPadding, formatValue);
  const lines = Object.entries(obj).map(formattedEntry);
  return lines.join('\n');
};

const formatCurried = R.curry(format);

module.exports = format;
module.exports.defaultFormat = formatCurried(DEFAULT_PADDING);
