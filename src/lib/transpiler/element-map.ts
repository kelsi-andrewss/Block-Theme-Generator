export interface ElementMapping {
  blockName: string;
  wpName: string;
  tagName: string;
  cssClass: string;
  selfClosing: boolean;
  extractAttrs?: (props: Record<string, unknown>, tagName: string) => Record<string, unknown>;
}

const headingExtract = (_props: Record<string, unknown>, tagName: string): Record<string, unknown> => {
  const level = parseInt(tagName.charAt(1), 10);
  return { level };
};

const groupTagExtract = (_props: Record<string, unknown>, tagName: string): Record<string, unknown> => {
  if (tagName === 'main') {
    return { tagName, layout: { type: 'constrained', contentSize: '100%' } };
  }
  if (tagName === 'section') {
    return { tagName, layout: { type: 'constrained' } };
  }
  if (tagName === 'div') return {};
  return { tagName };
};

const imgExtract = (props: Record<string, unknown>): Record<string, unknown> => {
  const attrs: Record<string, unknown> = {};
  if (props.src) attrs.url = props.src;
  if (props.alt) attrs.alt = props.alt;
  return attrs;
};

const listExtract = (_props: Record<string, unknown>, tagName: string): Record<string, unknown> => {
  return { ordered: tagName === 'ol' };
};

const GROUP_TAGS = ['div', 'section', 'main', 'header', 'footer', 'aside', 'article'] as const;

const elementMap: Record<string, ElementMapping> = {};

for (const tag of GROUP_TAGS) {
  elementMap[tag] = {
    blockName: 'core/group',
    wpName: 'group',
    tagName: tag,
    cssClass: 'wp-block-group',
    selfClosing: false,
    extractAttrs: groupTagExtract,
  };
}

for (let i = 1; i <= 6; i++) {
  elementMap[`h${i}`] = {
    blockName: 'core/heading',
    wpName: 'heading',
    tagName: `h${i}`,
    cssClass: 'wp-block-heading',
    selfClosing: false,
    extractAttrs: headingExtract,
  };
}

elementMap['p'] = {
  blockName: 'core/paragraph',
  wpName: 'paragraph',
  tagName: 'p',
  cssClass: '',
  selfClosing: false,
};

elementMap['img'] = {
  blockName: 'core/image',
  wpName: 'image',
  tagName: 'img',
  cssClass: 'wp-block-image',
  selfClosing: true,
  extractAttrs: imgExtract,
};

elementMap['button'] = {
  blockName: 'core/button',
  wpName: 'button',
  tagName: 'button',
  cssClass: 'wp-block-button',
  selfClosing: false,
};

elementMap['ul'] = {
  blockName: 'core/list',
  wpName: 'list',
  tagName: 'ul',
  cssClass: '',
  selfClosing: false,
  extractAttrs: listExtract,
};

elementMap['ol'] = {
  blockName: 'core/list',
  wpName: 'list',
  tagName: 'ol',
  cssClass: '',
  selfClosing: false,
  extractAttrs: listExtract,
};

elementMap['li'] = {
  blockName: 'core/list-item',
  wpName: 'list-item',
  tagName: 'li',
  cssClass: '',
  selfClosing: false,
};

elementMap['hr'] = {
  blockName: 'core/separator',
  wpName: 'separator',
  tagName: 'hr',
  cssClass: 'wp-block-separator',
  selfClosing: true,
};

elementMap['figure'] = {
  blockName: 'core/image',
  wpName: 'image',
  tagName: 'figure',
  cssClass: 'wp-block-image',
  selfClosing: false,
};

elementMap['nav'] = {
  blockName: 'core/navigation',
  wpName: 'navigation',
  tagName: 'nav',
  cssClass: 'wp-block-navigation',
  selfClosing: false,
};

elementMap['blockquote'] = {
  blockName: 'core/quote',
  wpName: 'quote',
  tagName: 'blockquote',
  cssClass: 'wp-block-quote',
  selfClosing: false,
};

// Inline elements pass through as raw HTML — they can't be WP blocks
const INLINE_TAGS = new Set(['span', 'strong', 'em', 'b', 'i', 'br', 'small', 'sub', 'sup', 'abbr', 'code', 'mark', 'a']);

const FALLBACK_MAPPING: ElementMapping = {
  blockName: 'core/group',
  wpName: 'group',
  tagName: 'div',
  cssClass: 'wp-block-group',
  selfClosing: false,
};

export function isInlineTag(tagName: string): boolean {
  return INLINE_TAGS.has(tagName);
}

export function getElementMapping(tagName: string, props: Record<string, unknown>): ElementMapping {
  if (tagName === 'a' && props.role === 'button') {
    return elementMap['button'];
  }
  return elementMap[tagName] || FALLBACK_MAPPING;
}

export { elementMap };
