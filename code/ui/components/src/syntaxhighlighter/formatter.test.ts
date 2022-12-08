import { dedent } from 'ts-dedent';

import { formatter } from './formatter';

describe('dedent', () => {
  test('handles empty string', () => {
    const input = '';
    const result = formatter(true, input);

    expect(result).toBe(input);
  });

  test('handles single line', () => {
    const input = 'console.log("hello world")';
    const result = formatter(true, input);

    expect(result).toBe(input);
  });

  test('does not transform correct code', () => {
    const input = dedent`
    console.log("hello");
    console.log("world");
  `;
    const result = formatter(true, input);

    expect(result).toBe(input);
  });

  test('does transform incorrect code', () => {
    const input = `
    console.log("hello");
    console.log("world");
  `;
    const result = formatter(true, input);

    expect(result).toBe(`console.log("hello");
console.log("world");`);
  });

  test('more indentations - skip first line', () => {
    const input = `
    test('handles empty string', () => {
      const input = '';
      const result = formatter(input);
    
      expect(result).toBe(input);
    });
  `;
    const result = formatter(true, input);

    expect(result).toBe(`test('handles empty string', () => {
  const input = '';
  const result = formatter(input);

  expect(result).toBe(input);
});`);
  });

  test('more indentations - code on first line', () => {
    const input = `// some comment
    test('handles empty string', () => {
      const input = '';
      const result = formatter(input);
    
      expect(result).toBe(input);
    });
  `;
    const result = formatter(true, input);

    expect(result).toBe(`// some comment
test('handles empty string', () => {
  const input = '';
  const result = formatter(input);

  expect(result).toBe(input);
});`);
  });

  test('removes whitespace in empty line completely', () => {
    const input = `
    console.log("hello");

    console.log("world");
  `;
    const result = formatter(true, input);

    expect(result).toBe(`console.log("hello");

console.log("world");`);
  });
});

describe('prettier (babel)', () => {
  test('handles empty string', () => {
    const input = '';
    const result = formatter('angular', input);

    expect(result).toBe(input);
  });

  test('handles single line', () => {
    const input = 'console.log("hello world")';
    const result = formatter('angular', input);

    expect(result).toBe(input);
  });
});
