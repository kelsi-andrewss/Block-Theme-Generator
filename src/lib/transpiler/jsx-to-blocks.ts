import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { getElementMapping, isInlineTag } from './element-map';
import { convertStylesToBlockAttrs } from './style-map';
import { getNestingAction, isSpecialBlock, renderSpecialBlock } from './nesting-rules';

function emitBlockOpen(wpName: string, attrs: Record<string, unknown>): string {
  const attrStr = Object.keys(attrs).length > 0 ? ` ${JSON.stringify(attrs)}` : '';
  return `<!-- wp:${wpName}${attrStr} -->`;
}

function emitBlockClose(wpName: string): string {
  return `<!-- /wp:${wpName} -->`;
}

function emitSelfClosingBlock(wpName: string, attrs: Record<string, unknown>): string {
  const attrStr = Object.keys(attrs).length > 0 ? ` ${JSON.stringify(attrs)}` : '';
  return `<!-- wp:${wpName}${attrStr} /-->`;
}

function stylesToString(styles: Record<string, string>): string {
  return Object.entries(styles)
    .map(([k, v]) => `${camelToKebab(k)}:${v}`)
    .join(';');
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function evaluateJSXValue(node: t.Node): unknown {
  if (t.isStringLiteral(node)) return node.value;
  if (t.isNumericLiteral(node)) return node.value;
  if (t.isBooleanLiteral(node)) return node.value;
  if (t.isNullLiteral(node)) return null;
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    return node.quasis.map((q) => q.value.cooked ?? q.value.raw).join('');
  }
  if (t.isJSXExpressionContainer(node)) return evaluateJSXValue(node.expression);
  if (t.isObjectExpression(node)) {
    const obj: Record<string, unknown> = {};
    for (const prop of node.properties) {
      if (t.isObjectProperty(prop)) {
        const key = t.isIdentifier(prop.key) ? prop.key.name : t.isStringLiteral(prop.key) ? prop.key.value : null;
        if (key !== null) {
          obj[key] = evaluateJSXValue(prop.value);
        }
      }
    }
    return obj;
  }
  return undefined;
}

function extractProps(attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const attr of attributes) {
    if (t.isJSXSpreadAttribute(attr)) continue;
    if (!t.isJSXIdentifier(attr.name)) continue;
    const name = attr.name.name;
    if (attr.value === null || attr.value === undefined) {
      props[name] = true;
      continue;
    }
    if (t.isStringLiteral(attr.value)) {
      props[name] = attr.value.value;
      continue;
    }
    if (t.isJSXExpressionContainer(attr.value)) {
      const val = evaluateJSXValue(attr.value.expression);
      if (val !== undefined) props[name] = val;
    }
  }
  return props;
}

function extractClassAlignAttrs(className: string): Record<string, unknown> {
  const attrs: Record<string, unknown> = {};
  const alignMatch = className.match(/has-text-align-(\w+)/);
  if (alignMatch) {
    attrs.textAlign = alignMatch[1];
  }
  const bgMatch = className.match(/has-(\w[\w-]*)-background-color/);
  if (bgMatch) {
    attrs.backgroundColor = bgMatch[1];
  }
  const textMatch = className.match(/has-(\w[\w-]*)-color(?!\s*-)/);
  if (textMatch && !textMatch[0].includes('background')) {
    attrs.textColor = textMatch[1];
  }
  return attrs;
}

function buildHtmlAttrs(
  cssClass: string,
  extraClasses: string,
  residualStyles: Record<string, string>,
  htmlAttrs: Record<string, string>,
): string {
  const parts: string[] = [];

  const combinedClass = [cssClass, extraClasses].filter(Boolean).join(' ');
  if (combinedClass) {
    parts.push(`class="${combinedClass}"`);
  }

  const styleStr = stylesToString(residualStyles);
  if (styleStr) {
    parts.push(`style="${styleStr}"`);
  }

  for (const [k, v] of Object.entries(htmlAttrs)) {
    parts.push(`${k}="${v}"`);
  }

  return parts.length > 0 ? ' ' + parts.join(' ') : '';
}

function processNode(node: t.Node, parentWpName: string | null): string {
  if (t.isJSXFragment(node)) {
    return processChildren(node.children, parentWpName);
  }

  if (t.isJSXText(node)) {
    const text = node.value.replace(/\n\s*/g, ' ').trim();
    return text;
  }

  if (t.isJSXExpressionContainer(node)) {
    if (t.isJSXEmptyExpression(node.expression)) return '';
    if (t.isStringLiteral(node.expression)) return node.expression.value;
    if (t.isTemplateLiteral(node.expression) && node.expression.expressions.length === 0) {
      return node.expression.quasis.map((q) => q.value.cooked ?? q.value.raw).join('');
    }
    return '';
  }

  if (!t.isJSXElement(node)) return '';

  const opening = node.openingElement;
  let tagName: string;

  if (t.isJSXIdentifier(opening.name)) {
    tagName = opening.name.name;
  } else if (t.isJSXMemberExpression(opening.name)) {
    tagName = '';
  } else {
    tagName = '';
  }

  if (!tagName) {
    return processChildren(node.children, parentWpName);
  }

  const isComponentTag = tagName[0] === tagName[0].toUpperCase() && tagName[0] !== tagName[0].toLowerCase();
  if (isComponentTag) {
    tagName = tagName.toLowerCase();
  }

  // Inline elements (span, strong, em, a without role=button, etc.) render as raw HTML, not blocks
  const props = extractProps(opening.attributes);
  if (isInlineTag(tagName) && !(tagName === 'a' && props.role === 'button')) {
    const children = processChildren(node.children, parentWpName);
    const styleObj = typeof props.style === 'object' && props.style !== null ? props.style as Record<string, string> : null;
    const styleStr = styleObj ? ` style="${stylesToString(styleObj)}"` : '';
    const cls = props.className ? ` class="${props.className}"` : '';
    const href = typeof props.href === 'string' ? ` href="${props.href}"` : '';
    if (tagName === 'br') return '<br />';
    return `<${tagName}${cls}${styleStr}${href}>${children}</${tagName}>`;
  }
  const mapping = getElementMapping(tagName, props);
  const wpName = mapping.wpName;

  const blockAttrs: Record<string, unknown> = {};
  let residualStyles: Record<string, string> = {};
  const htmlAttrs: Record<string, string> = {};
  let extraClasses = '';

  if (mapping.extractAttrs) {
    Object.assign(blockAttrs, mapping.extractAttrs(props, tagName));
  }

  for (const [key, value] of Object.entries(props)) {
    if (key === 'style' && typeof value === 'object' && value !== null) {
      const styleObj = value as Record<string, string>;
      const skipLayout = wpName === 'list-item' || wpName === 'list';
      const result = convertStylesToBlockAttrs(styleObj, skipLayout);
      mergeDeep(blockAttrs, result.blockAttrs);
      mergeDeep(blockAttrs, result.layoutAttrs);
      residualStyles = { ...residualStyles, ...result.residualStyles };
      continue;
    }

    if (key === 'className') {
      extraClasses = String(value);
      const classAttrs = extractClassAlignAttrs(extraClasses);
      Object.assign(blockAttrs, classAttrs);
      continue;
    }

    if (key === 'src' && wpName === 'image') {
      blockAttrs.url = value;
      continue;
    }
    if (key === 'alt' && wpName === 'image') {
      blockAttrs.alt = value;
      continue;
    }
    if (key === 'href') {
      blockAttrs.url = value;
      continue;
    }

    if (key === 'role' || key === 'id') continue;

    if (typeof value === 'string') {
      htmlAttrs[key] = value;
    }
  }

  const nestingAction = getNestingAction(wpName, parentWpName);
  const lines: string[] = [];

  for (const wrapper of nestingAction.wrapBefore) {
    const wrapAttrs = Object.keys(wrapper.attrs).length > 0 ? ` ${JSON.stringify(wrapper.attrs)}` : '';
    lines.push(`<!-- wp:${wrapper.wpName}${wrapAttrs} -->`);
    lines.push(wrapper.openTag);
  }

  if (mapping.selfClosing) {
    lines.push(emitSelfClosingBlock(wpName, blockAttrs));
  } else if (isSpecialBlock(wpName)) {
    const childContent = processChildren(node.children, wpName);
    const inlineStyle = stylesToString(residualStyles);
    const innerHtml = renderSpecialBlock(wpName, childContent, blockAttrs, inlineStyle);
    lines.push(emitBlockOpen(wpName, blockAttrs));
    lines.push(innerHtml);
    lines.push(emitBlockClose(wpName));
  } else {
    const childContent = processChildren(node.children, wpName);
    const actualTag = mapping.tagName;
    const attrs = buildHtmlAttrs(mapping.cssClass, extraClasses, residualStyles, htmlAttrs);

    lines.push(emitBlockOpen(wpName, blockAttrs));
    const hasBlockChildren = childContent.includes('<!-- wp:');
    if (hasBlockChildren) {
      lines.push(`<${actualTag}${attrs}>`);
      lines.push(childContent);
      lines.push(`</${actualTag}>`);
    } else {
      lines.push(`<${actualTag}${attrs}>${childContent}</${actualTag}>`);
    }
    lines.push(emitBlockClose(wpName));
  }

  for (const wrapper of nestingAction.wrapAfter) {
    lines.push(wrapper.closeTag);
    lines.push(`<!-- /wp:${wrapper.wpName} -->`);
  }

  return lines.join('\n');
}

function processChildren(children: t.Node[], parentWpName: string | null): string {
  const rendered = children.map((child) => processNode(child, parentWpName)).filter(Boolean);
  return rendered.join('\n');
}

function mergeDeep(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      mergeDeep(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
    } else {
      target[key] = source[key];
    }
  }
}

export function transpileJSXToBlocks(jsx: string): string {
  const wrappedJsx = jsx.trim();
  const ast = parse(wrappedJsx, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const body = ast.program.body;
  if (body.length === 0) return '';

  const stmt = body[0];
  if (t.isExpressionStatement(stmt)) {
    return processNode(stmt.expression, null);
  }

  return '';
}
