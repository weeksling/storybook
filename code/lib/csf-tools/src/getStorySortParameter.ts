import * as t from '@babel/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as traverse from '@babel/traverse';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as generate from '@babel/generator';
import { dedent } from 'ts-dedent';
import { babelParse } from './babelParse';

const logger = console;

const getValue = (obj: t.ObjectExpression, key: string) => {
  let value: t.Expression;
  obj.properties.forEach((p: t.ObjectProperty) => {
    if (t.isIdentifier(p.key) && p.key.name === key) {
      value = p.value as t.Expression;
    }
  });
  return value;
};

const parseValue = (expr: t.Expression): any => {
  if (t.isArrayExpression(expr)) {
    return expr.elements.map((o: t.Expression) => {
      return parseValue(o);
    });
  }
  if (t.isObjectExpression(expr)) {
    return expr.properties.reduce((acc, p: t.ObjectProperty) => {
      if (t.isIdentifier(p.key)) {
        acc[p.key.name] = parseValue(p.value as t.Expression);
      }
      return acc;
    }, {} as any);
  }
  if (t.isLiteral(expr)) {
    // @ts-expect-error (Converted from ts-ignore)
    return expr.value;
  }
  throw new Error(`Unknown node type ${expr}`);
};

const unsupported = (unexpectedVar: string, isError: boolean) => {
  const message = dedent`
    Unexpected '${unexpectedVar}'. Parameter 'options.storySort' should be defined inline e.g.:

    export const parameters = {
      options: {
        storySort: <array | object | function>
      }
    }
  `;
  if (isError) {
    throw new Error(message);
  } else {
    logger.info(message);
  }
};

export const getStorySortParameter = (previewCode: string) => {
  let storySort: t.Expression;
  const ast = babelParse(previewCode);
  traverse.default(ast, {
    ExportNamedDeclaration: {
      enter({ node }) {
        if (t.isVariableDeclaration(node.declaration)) {
          node.declaration.declarations.forEach((decl) => {
            if (t.isVariableDeclarator(decl) && t.isIdentifier(decl.id)) {
              const { name: exportName } = decl.id;
              if (exportName === 'parameters') {
                const paramsObject = t.isTSAsExpression(decl.init)
                  ? decl.init.expression
                  : decl.init;
                if (t.isObjectExpression(paramsObject)) {
                  const options = getValue(paramsObject, 'options');
                  if (options) {
                    if (t.isObjectExpression(options)) {
                      storySort = getValue(options, 'storySort');
                    } else {
                      unsupported('options', true);
                    }
                  }
                } else {
                  unsupported('parameters', true);
                }
              }
            }
          });
        } else {
          node.specifiers.forEach((spec) => {
            if (t.isIdentifier(spec.exported) && spec.exported.name === 'parameters') {
              unsupported('parameters', false);
            }
          });
        }
      },
    },
  });

  if (!storySort) return undefined;

  if (t.isArrowFunctionExpression(storySort)) {
    const { code: sortCode } = generate.default(storySort, {});
    // eslint-disable-next-line no-eval
    return (0, eval)(sortCode);
  }

  if (t.isFunctionExpression(storySort)) {
    const { code: sortCode } = generate.default(storySort, {});
    const functionName = storySort.id.name;
    // Wrap the function within an arrow function, call it, and return
    const wrapper = `(a, b) => {
      ${sortCode};
      return ${functionName}(a, b)
    }`;
    // eslint-disable-next-line no-eval
    return (0, eval)(wrapper);
  }

  if (t.isLiteral(storySort) || t.isArrayExpression(storySort) || t.isObjectExpression(storySort)) {
    return parseValue(storySort);
  }

  return unsupported('storySort', true);
};
