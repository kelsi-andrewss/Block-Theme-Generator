export function extractPresetSlug(value: string): string | null {
  const colorMatch = value.match(/^var\(--wp--preset--color--([^)]+)\)$/);
  if (colorMatch) return colorMatch[1];
  const fontSizeMatch = value.match(/^var\(--wp--preset--font-size--([^)]+)\)$/);
  if (fontSizeMatch) return fontSizeMatch[1];
  return null;
}

export function parseShorthandSpacing(value: string): { top: string; right: string; bottom: string; left: string } {
  const parts = value.trim().split(/\s+/);
  switch (parts.length) {
    case 1:
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    case 2:
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    case 3:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    case 4:
    default:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }
}

interface StyleConversionResult {
  blockAttrs: Record<string, unknown>;
  residualStyles: Record<string, string>;
}

function deepSet(obj: Record<string, unknown>, path: string[], value: unknown): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!(path[i] in current) || typeof current[path[i]] !== 'object' || current[path[i]] === null) {
      current[path[i]] = {};
    }
    current = current[path[i]] as Record<string, unknown>;
  }
  current[path[path.length - 1]] = value;
}

const SPACING_SHORTHAND = ['padding', 'margin'] as const;
const SPACING_LONGHAND: Record<string, [string, string]> = {
  paddingTop: ['padding', 'top'],
  paddingRight: ['padding', 'right'],
  paddingBottom: ['padding', 'bottom'],
  paddingLeft: ['padding', 'left'],
  marginTop: ['margin', 'top'],
  marginRight: ['margin', 'right'],
  marginBottom: ['margin', 'bottom'],
  marginLeft: ['margin', 'left'],
};

const TYPOGRAPHY_PROPS: Record<string, string> = {
  fontSize: 'fontSize',
  fontWeight: 'fontWeight',
  lineHeight: 'lineHeight',
  fontFamily: 'fontFamily',
  letterSpacing: 'letterSpacing',
  textTransform: 'textTransform',
  textDecoration: 'textDecoration',
};

const BORDER_PROPS: Record<string, string> = {
  borderRadius: 'radius',
  borderColor: 'color',
  borderWidth: 'width',
  borderStyle: 'style',
};

export function convertStylesToBlockAttrs(styles: Record<string, string>): StyleConversionResult {
  const blockAttrs: Record<string, unknown> = {};
  const residualStyles: Record<string, string> = {};

  const entries = Object.entries(styles);

  for (const [prop, value] of entries) {
    if ((SPACING_SHORTHAND as readonly string[]).includes(prop)) {
      const expanded = parseShorthandSpacing(value);
      deepSet(blockAttrs, ['style', 'spacing', prop], expanded);
      continue;
    }

    if (prop in SPACING_LONGHAND) {
      const [type, side] = SPACING_LONGHAND[prop];
      deepSet(blockAttrs, ['style', 'spacing', type, side], value);
      continue;
    }

    if (prop === 'backgroundColor') {
      const slug = extractPresetSlug(value);
      if (slug) {
        blockAttrs.backgroundColor = slug;
      } else {
        deepSet(blockAttrs, ['style', 'color', 'background'], value);
      }
      continue;
    }

    if (prop === 'color') {
      const slug = extractPresetSlug(value);
      if (slug) {
        blockAttrs.textColor = slug;
      } else {
        deepSet(blockAttrs, ['style', 'color', 'text'], value);
      }
      continue;
    }

    if (prop in TYPOGRAPHY_PROPS) {
      const slug = (prop === 'fontSize') ? extractPresetSlug(value) : null;
      if (slug) {
        blockAttrs.fontSize = slug;
      } else {
        deepSet(blockAttrs, ['style', 'typography', TYPOGRAPHY_PROPS[prop]], value);
      }
      continue;
    }

    if (prop in BORDER_PROPS) {
      deepSet(blockAttrs, ['style', 'border', BORDER_PROPS[prop]], value);
      continue;
    }

    residualStyles[prop] = value;
  }

  return { blockAttrs, residualStyles };
}
