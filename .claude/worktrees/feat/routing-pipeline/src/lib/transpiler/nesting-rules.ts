export interface WrapperBlock {
  wpName: string;
  attrs: Record<string, unknown>;
  openTag: string;
  closeTag: string;
}

export interface NestingAction {
  wrapBefore: WrapperBlock[];
  wrapAfter: WrapperBlock[];
}

const NESTING_REQUIREMENTS: Record<string, { requiredParent: string; wrapper: WrapperBlock }> = {
  button: {
    requiredParent: 'buttons',
    wrapper: {
      wpName: 'buttons',
      attrs: {},
      openTag: '<div class="wp-block-buttons">',
      closeTag: '</div>',
    },
  },
  'list-item': {
    requiredParent: 'list',
    wrapper: {
      wpName: 'list',
      attrs: {},
      openTag: '<ul>',
      closeTag: '</ul>',
    },
  },
  column: {
    requiredParent: 'columns',
    wrapper: {
      wpName: 'columns',
      attrs: {},
      openTag: '<div class="wp-block-columns">',
      closeTag: '</div>',
    },
  },
};

const EMPTY_ACTION: NestingAction = { wrapBefore: [], wrapAfter: [] };

export function getNestingAction(blockWpName: string, parentWpName: string | null): NestingAction {
  const rule = NESTING_REQUIREMENTS[blockWpName];
  if (!rule) return EMPTY_ACTION;
  if (parentWpName === rule.requiredParent) return EMPTY_ACTION;
  return {
    wrapBefore: [rule.wrapper],
    wrapAfter: [rule.wrapper],
  };
}

const SPECIAL_BLOCKS = new Set(['button', 'image']);

export function isSpecialBlock(wpName: string): boolean {
  return SPECIAL_BLOCKS.has(wpName);
}

export function renderSpecialBlock(
  wpName: string,
  children: string,
  _attrs: Record<string, unknown>,
  inlineStyle: string,
): string {
  if (wpName === 'button') {
    const styleAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
    const hrefAttr = _attrs.url ? ` href="${_attrs.url}"` : '';
    return `<div class="wp-block-button"><a class="wp-block-button__link wp-element-button"${hrefAttr}${styleAttr}>${children}</a></div>`;
  }

  if (wpName === 'image') {
    const url = (_attrs.url as string) || '';
    const alt = (_attrs.alt as string) || '';
    const styleAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
    return `<figure class="wp-block-image"${styleAttr}><img src="${url}" alt="${alt}" /></figure>`;
  }

  return children;
}
