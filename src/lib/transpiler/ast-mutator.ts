import * as recast from 'recast';
import { parse as babelParse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import type { NodePath } from '@babel/traverse';
import { getComponentDef } from './wp-components';

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
  elementPath.node.children = [];
  if (textContent !== "") {
    elementPath.node.children.push(
      t.jsxExpressionContainer(t.stringLiteral(textContent))
    );
  }
}

function handleHtml(elementPath: NodePath<t.JSXElement>, html: string): void {
  let sanitized = html;
  
  // Close void elements so JSX parser doesn't crash
  const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
  for (const tag of voidTags) {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    sanitized = sanitized.replace(regex, `<${tag}$1 />`);
  }

  // Convert HTML attributes to React equivalents
  sanitized = sanitized.replace(/\bclass=(["'])/gi, 'className=$1');
  sanitized = sanitized.replace(/\bfor=(["'])/gi, 'htmlFor=$1');

  // Strip HTML comments which break JSX parsing
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

  const fragmentAst = recast.parse(sanitized, {
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
  const wrapped = `[${source}]`;
  const ast = recast.parse(wrapped, {
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
      if (!isUpper) return tag;
      const def = getComponentDef(tag);
      return def?.htmlTag ?? 'div';
    }
    return 'div';
  }

  function walk(node: t.Node, pathId: string): void {
    if (t.isJSXElement(node)) {
      const hasUid = node.openingElement.attributes.some(
        attr => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === 'data-uid'
      );

      if (!hasUid) {
        const resolved = resolveTag(node.openingElement.name);
        const uid = `${resolved}-${pathId}`;
        node.openingElement.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-uid'), t.stringLiteral(uid))
        );
      }

      let childElementIndex = 0;
      for (const child of node.children) {
        if (t.isJSXElement(child)) {
          walk(child, `${pathId}.${childElementIndex++}`);
        } else if (t.isJSXFragment(child)) {
          // Fragments are depth-transparent
          for (const fChild of child.children) {
            if (t.isJSXElement(fChild)) {
              walk(fChild, `${pathId}.${childElementIndex++}`);
            }
          }
        } else if (t.isJSXExpressionContainer(child)) {
          // Match JsxStringRenderer: HTML-string expressions consume a sibling index
          if (!t.isJSXEmptyExpression(child.expression)) {
            let str: string | null = null;
            if (t.isStringLiteral(child.expression)) str = child.expression.value;
            else if (t.isTemplateLiteral(child.expression) && child.expression.expressions.length === 0) {
              str = child.expression.quasis.map((q: any) => q.value.cooked ?? q.value.raw).join("");
            }
            if (str !== null && /<[a-zA-Z][\s\S]*?>/.test(str)) {
              childElementIndex++;
            }
          }
        }
      }
    } else if (t.isJSXFragment(node)) {
      let childElementIndex = 0;
      for (const child of node.children) {
        if (t.isJSXElement(child)) {
          walk(child, `${pathId}.${childElementIndex++}`);
        } else if (t.isJSXExpressionContainer(child)) {
          if (!t.isJSXEmptyExpression(child.expression)) {
            let str: string | null = null;
            if (t.isStringLiteral(child.expression)) str = child.expression.value;
            else if (t.isTemplateLiteral(child.expression) && child.expression.expressions.length === 0) {
              str = child.expression.quasis.map((q: any) => q.value.cooked ?? q.value.raw).join("");
            }
            if (str !== null && /<[a-zA-Z][\s\S]*?>/.test(str)) {
              childElementIndex++;
            }
          }
        }
      }
    }
  }

  const rootExpr = ast.program.body[0];
  if (t.isExpressionStatement(rootExpr) && t.isArrayExpression(rootExpr.expression)) {
    const rawNode = rootExpr.expression.elements[0];
    if (rawNode) {
      walk(rawNode, "0");
      return recast.print(rawNode).code;
    }
  }

  return source;
}

export function applyAstMutation(source: string, intents: EditIntent[]): string {
  const wrapped = `[${source}]`;
  const ast = recast.parse(wrapped, {
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

  const uidMap = buildUidMap(ast as unknown as t.File);

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

  const rootExpr = ast.program.body[0];
  if (t.isExpressionStatement(rootExpr) && t.isArrayExpression(rootExpr.expression)) {
    const rawNode = rootExpr.expression.elements[0];
    if (rawNode) return injectUids(recast.print(rawNode).code);
  }

  return source;
}
