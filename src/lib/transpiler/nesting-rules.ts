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
    
    // WordPress core CSS sets .wp-block-image img { height: auto; max-width: 100% }.
    // Thus if the parent <figure> gets a max-height (e.g. replacing a short wide element), 
    // the image calculates height proportionally to its max-width and violently overflows the figure.
    // Propagating 100% bounds down to the native <img> forces it to respect the figure wrapper entirely.
    let imgStyle = '';
    if (inlineStyle) {
      let objFit = 'cover';
      let maxW = '';
      let maxH = '';

      if (inlineStyle.includes('object-fit:')) {
        const match = inlineStyle.match(/object-fit:\s*([^;]+)/);
        if (match) objFit = match[1].trim();
      }
      if (inlineStyle.includes('max-width:')) {
        const match = inlineStyle.match(/max-width:\s*([^;]+)/);
        if (match) maxW = `max-width:${match[1].trim()};`;
      }
      if (inlineStyle.includes('max-height:')) {
        const match = inlineStyle.match(/max-height:\s*([^;]+)/);
        if (match) maxH = `max-height:${match[1].trim()};`;
      }

      imgStyle = ` style="width:100%;height:100%;${maxW}${maxH}object-fit:${objFit};"`;
    }
    
    return `<figure class="wp-block-image"${styleAttr}><img src="${url}" alt="${alt}"${imgStyle} /></figure>`;
  }

  return children;
}
