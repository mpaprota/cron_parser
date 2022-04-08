const parser = require('./parser');

const { parseField } = parser;

describe('Cron Parser', () => {
  it('should parse sample input (*/15 0 1,15 * 1-5 /usr/bin/find)', () => {
    const result = parser('*/15 0 1,15 * 1-5 /usr/bin/find');

    expect(result).toEqual({
      minutes: [0, 15, 30, 45],
      hours: [0],
      dayOfMonth: [1, 15],
      month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dayOfWeek: [1, 2, 3, 4, 5],
      command: '/usr/bin/find',
    });
  });

  describe('#parseField', () => {
    it('should parse multiple ranges, steps and values', () => {
      const result = parseField(0, 59)('1,1-1,3-6/2,5/5,8');
      expect(result).toEqual([1, 4, 5, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    });

    it('should parse asterisk', () => {
      const result = parseField(0, 28)('*/5,1,2');
      expect(result).toEqual([0, 1, 2, 5, 10, 15, 20, 25]);
    });

    it('should parse minutes', () => {
      const result = parseField(0, 59)('*/15');
      expect(result).toEqual([0, 15, 30, 45]);
    });
  });
});
