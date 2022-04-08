const format = require('./table-formatter');

describe('Table formatter', () => {
  it('should format strings ', () => {
    const o = {
      hello: 'world',
    };

    const result = format(1, o);

    expect(result).toEqual('hello world');
  });

  it('should format object with multiple properties ', () => {
    const o = {
      hello: 'world',
      world: 'hello',
    };

    const result = format(1, o);

    expect(result).toEqual('hello world\nworld hello');
  });

  it('should format array of numbers ', () => {
    const o = {
      hello: [1, 2, 3, 4, 5, 100],
    };

    const result = format(1, o);

    expect(result).toEqual('hello 1 2 3 4 5 100');
  });

  it('should format with end padding ', () => {
    const o = {
      hello: 'world',
    };

    const result = format(10, o);

    expect(result).toEqual('hello          world');
  });
});
