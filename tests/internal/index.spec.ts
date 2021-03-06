import { buildSubobject } from 'subobject/internal';
import { Selector } from 'subobject/internal/selector-tree';
import { expect } from 'chai';
import 'mocha';


describe('subobject/internal:buildSubobject', () => {
  it('should return the input value for non-objects', () => {
    const selectors: Selector[] = [{key: 'foo'}];

    const ident = (val: any) => expect(buildSubobject(selectors, val)).to.equal(val);

    ident(0);
    ident(1);
    ident('foo');
    ident(null);
    ident(undefined);
    ident(true);
    ident(false);
  });

  it('should return a simplified object when given shallow selectors', () => {
    const selectors: Selector[] = [
      {key: 'foo'},
      {key: 'bar'}
    ];

    const input = {
      foo: 123,
      bar: 'abc',
      baz: true
    };

    const expected = {
      foo: 123,
      bar: 'abc'
    };

    expect(buildSubobject(selectors, input)).to.deep.equal(expected);
  });

  it('should return a simplified object when given a deep filter tree', () => {
    const selectors: Selector[] = [
      {
        key: 'foo',
        children: [
          {key: 'bar'}
        ]
      }
    ];

    const input = {
      foo: {
        bar: 123,
        baz: 'abc'
      },
      blah: true
    };

    const expected = {
      foo: {
        bar: 123
      }
    };

    expect(buildSubobject(selectors, input)).to.deep.equal(expected);
  });

  it('should not include missing keys', () => {
    const selectors: Selector[] = [
      {key: 'foo'},
      {key: 'bar'},
      {
        key: 'baz',
        children: [
          {key: 'blip'}
        ]
      }
    ];

    const input = {
      foo: 123,
      blah: 'abc'
    };

    const expected = {
      foo: 123
    };

    expect(buildSubobject(selectors, input)).to.deep.equal(expected);
  });

  it('should ignore simple types', () => {
    const selectors = [
      {
        key: 'foo',
        children: [
          {key: 'bar'}
        ]
      }
    ];

    expect(buildSubobject(selectors, {foo: 123})).to.deep.equal({foo: 123});
    expect(buildSubobject(selectors, {foo: null})).to.deep.equal({foo: null});
    expect(buildSubobject(selectors, {foo: 'test'})).to.deep.equal({foo: 'test'});
  });

  it('should filter items of arrays', () => {
    const selectors: Selector[] = [
      {
        key: 'foo',
        children: [
          {key: 'bar'}
        ]
      }
    ];

    const input = {
      foo: [
        {bar: 123, baz: 'abc'},
        {bar: 456, baz: 'def'},
      ]
    };

    const expected = {
      foo: [
        {bar: 123},
        {bar: 456}
      ]
    };

    expect(buildSubobject(selectors, input)).to.deep.equal(expected);
  });

  it('should handle root arrays', () => {
    const selectors: Selector[] = [
      {key: 'foo'}
    ];

    const input = [
      {foo: 123, bar: 'abc'},
      {foo: 456, bar: 'def'}
    ];

    const expected = [
      {foo: 123},
      {foo: 456}
    ];

    expect(buildSubobject(selectors, input)).to.deep.equal(expected);
  });

  it('should handle nested arrays', () => {
    const selectors: Selector[] = [
      {key: 'foo'}
    ];

    const input = [
      [{foo: 123, bar: 'abc'}],
      [{foo: 456, bar: 'def'}]
    ];

    const expected = [
      [{foo: 123}],
      [{foo: 456}]
    ];

    expect(buildSubobject(selectors, input)).to.deep.equal(expected);
  });
});
