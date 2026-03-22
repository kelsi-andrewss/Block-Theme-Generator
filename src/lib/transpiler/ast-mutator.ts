import * as recast from 'recast';
import { parse as babelParse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import type { NodePath } from '@babel/traverse';

export type EditIntent =
  | { kind: 'style'; uid: string; styles: Record<string, string> }
  | { kind: 'text'; uid: string; textContent: string }
  | { kind: 'attribute'; uid: string; attributes: Record<string, string | null> }
  | { kind: 'html'; uid: string; html: string };

function buildUidMap(ast: t.File): Map<string, NodePath<t.JSXElement>> {
  const map = new Map<string, NodePath<t.JSXElement>>();

  traverse(ast, {
    JSXOpeningElement(path) {
      for (const attr of path.node.attributes) {
        if (
          t.isJSXAttribute(attr) &&
          t.isJSXIdentifier(attr.name) &&
          attr.name.name === 'data-uid' &&
          t.isStringLiteral(attr.value)
        ) {
          const elementPath = path.parentPath as NodePath<t.JSXElement>;
          map.set(attr.value.value, elementPath);
        }
      }
    },
  });

  return map;
}

function handleStyle(elementPath: NodePath<t.JSXElement>, styles: Record<string, string>): void {
  const opening = elementPath.node.openingElement;

  let styleAttrIndex = -1;
  for (let i = 0; i < opening.attributes.length; i++) {
    const attr = opening.attributes[i];
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === 'style') {
      styleAttrIndex = i;
      break;
    }
  }

  if (styleAttrIndex === -1) {
    const properties = Object.entries(styles).map(([key, value]) =>
      t.objectProperty(t.identifier(key), t.stringLiteral(value))
    );
    const styleAttr = t.jsxAttribute(
      t.jsxIdentifier('style'),
      t.jsxExpressionContainer(t.objectExpression(properties))
    );
    opening.attributes.push(styleAttr);
    return;
  }

  const styleAttr = opening.attributes[styleAttrIndex] as t.JSXAttribute;
  if (
    !t.isJSXExpressionContainer(styleAttr.value) ||
    !t.isObjectExpression(styleAttr.value.expression)
  ) {
    return;
  }

  const objExpr = styleAttr.value.expression;

  for (const [key, value] of Object.entries(styles)) {
    if (value === '') {
      objExpr.properties = objExpr.properties.filter((prop) => {
        if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
          return prop.key.name !== key;
        }
        if (t.isObjectProperty(prop) && t.isStringLiteral(prop.key)) {
          return prop.key.value !== key;
        }
        return true;
      });
      continue;
    }

    let found = false;
    for (const prop of objExpr.properties) {
      if (t.isObjectProperty(prop)) {
        const propKey = t.isIdentifier(prop.key) ? prop.key.name : t.isStringLiteral(prop.key) ? prop.key.value : null;
        if (propKey === key) {
          prop.value = t.stringLiteral(value);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      objExpr.properties.push(
        t.objectProperty(t.identifier(key), t.stringLiteral(value))
      );
    }
  }

  if (objExpr.properties.length === 0) {
    opening.attributes.splice(styleAttrIndex, 1);
  }
}

function handleAttribute(elementPath: NodePath<t.JSXElement>, attributes: Record<string, string | null>): void {
  const opening = elementPath.node.openingElement;

  for (const [name, value] of Object.entries(attributes)) {
    const existingIndex = opening.attributes.findIndex(
      (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === name
    );

    if (value === null) {
      if (existingIndex !== -1) {
        opening.attributes.splice(existingIndex, 1);
      }
      continue;
    }

    const newAttr = t.jsxAttribute(
      t.jsxIdentifier(name),
      t.stringLiteral(value)
    );

    if (existingIndex !== -1) {
      opening.attributes[existingIndex] = newAttr;
    } else {
      opening.attributes.push(newAttr);
    }
  }
}

function handleText(elementPath: NodePath<t.JSXElement>, textContent: string): void {
  elementPath.node.children = [t.jsxText(textContent)];
}

function handleHtml(elementPath: NodePath<t.JSXElement>, html: string): void {
  const fragmentAst = recast.parse(html, {
    parser: {
      parse(src: string) {
        return babelParse(src, {
          sourceType: 'module',
          plugins: ['jsx'],
          tokens: true,
        });
      },
    },
  });

  const body = fragmentAst.program.body;
  if (body.length === 0) return;

  const stmt = body[0];
  if (!t.isExpressionStatement(stmt)) return;

  elementPath.replaceWith(stmt.expression);
}

/**
 * Inject data-uid attributes into a JSX source string using the same
 * positional scheme as JsxStringRenderer's generateUid(tag, depth, siblingIndex).
 * This makes the source the single source of truth for UIDs — both the
 * rendered DOM and the AST mutator reference the same IDs.
 */
export function injectUids(source: string): string {
  const ast = recast.parse(source, {
    parser: {
      parse(src: string) {
        return babelParse(src, {
          sourceType: 'module',
          plugins: ['jsx'],
          tokens: true,
        });
      },
    },
  });

  function resolveTag(name: t.JSXOpeningElement['name']): string {
    if (t.isJSXIdentifier(name)) {
      const tag = name.name;
      const isUpper = tag[0] === tag[0].toUpperCase() && tag[0] !== tag[0].toLowerCase();
      return isUpper ? 'div' : tag;
    }
    return 'div';
  }

  function walk(node: t.Node, depth: number, siblingIndex: number): void {
    if (t.isJSXElement(node)) {
      const resolved = resolveTag(node.openingElement.name);
      const uid = `${resolved}-${depth}-${siblingIndex}`;

      // Remove existing data-uid if present (re-stamp)
      node.openingElement.attributes = node.openingElement.attributes.filter(
        attr => !(t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === 'data-uid')
      );
      node.openingElement.attributes.push(
        t.jsxAttribute(t.jsxIdentifier('data-uid'), t.stringLiteral(uid))
      );

      let childElementIndex = 0;
      for (const child of node.children) {
        if (t.isJSXElement(child)) {
          walk(child, depth + 1, childElementIndex++);
        } else if (t.isJSXFragment(child)) {
          // Fragments are depth-transparent
          for (const fChild of child.children) {
            if (t.isJSXElement(fChild)) {
              walk(fChild, depth + 1, childElementIndex++);
            }
          }
        }
      }
    } else if (t.isJSXFragment(node)) {
      let childElementIndex = 0;
      for (const child of node.children) {
        if (t.isJSXElement(child)) {
          walk(child, depth, childElementIndex++);
        }
      }
    }
  }

  const body = ast.program.body;
  if (body.length > 0 && t.isExpressionStatement(body[0])) {
    walk(body[0].expression, 0, 0);
  }

  return recast.print(ast).code;
}

export function applyAstMutation(source: string, intents: EditIntent[]): string {
  const ast = recast.parse(source, {
    parser: {
      parse(src: string) {
        return babelParse(src, {
          sourceType: 'module',
          plugins: ['jsx'],
          tokens: true,
        });
      },
    },
  });

  const uidMap = buildUidMap(ast.program as unknown as t.File);

  for (const intent of intents) {
    const elementPath = uidMap.get(intent.uid);
    if (!elementPath) continue;

    switch (intent.kind) {
      case 'style':
        handleStyle(elementPath, intent.styles);
        break;
      case 'attribute':
        handleAttribute(elementPath, intent.attributes);
        break;
      case 'text':
        handleText(elementPath, intent.textContent);
        break;
      case 'html':
        handleHtml(elementPath, intent.html);
        break;
    }
  }

  return recast.print(ast).code;
}
