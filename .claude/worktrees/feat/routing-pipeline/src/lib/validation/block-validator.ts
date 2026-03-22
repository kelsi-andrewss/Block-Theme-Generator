export interface ValidationError {
  type: string;
  message: string;
  line?: number;
  block?: string;
}

export interface ValidationWarning {
  type: string;
  message: string;
  line?: number;
  block?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

const CORE_BLOCK_NAMES = new Set([
  "group",
  "paragraph",
  "heading",
  "image",
  "cover",
  "columns",
  "column",
  "query",
  "post-template",
  "post-title",
  "post-content",
  "post-featured-image",
  "post-excerpt",
  "post-date",
  "post-author",
  "post-terms",
  "navigation",
  "page-list",
  "site-title",
  "site-logo",
  "site-tagline",
  "template-part",
  "spacer",
  "separator",
  "buttons",
  "button",
  "search",
  "list",
  "list-item",
  "quote",
  "code",
  "video",
  "audio",
  "row",
  "stack",
  "categories",
  "archives",
  "comment-template",
  "comments",
  "post-comments-form",
  "loginout",
  "term-description",
  "query-title",
  "query-pagination",
  "query-pagination-next",
  "query-pagination-previous",
  "query-pagination-numbers",
  "query-no-results",
  "read-more",
  "avatar",
  "post-author-name",
  "post-author-biography",
  "pullquote",
  "preformatted",
  "verse",
  "table",
  "gallery",
  "media-text",
  "social-links",
  "social-link",
  "file",
  "embed",
]);

const OPENING_BLOCK_RE = /<!-- wp:(\S+)(\s+(\{.*?\}))?\s*(\/)?-->/g;
const CLOSING_BLOCK_RE = /<!-- \/wp:(\S+) -->/g;

interface BlockDelimiter {
  name: string;
  selfClosing: boolean;
  closing: boolean;
  line: number;
  attrs?: string;
}

function parseDelimiters(content: string): BlockDelimiter[] {
  const delimiters: BlockDelimiter[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    let match: RegExpExecArray | null;

    OPENING_BLOCK_RE.lastIndex = 0;
    while ((match = OPENING_BLOCK_RE.exec(line)) !== null) {
      delimiters.push({
        name: match[1],
        selfClosing: match[4] === "/",
        closing: false,
        line: lineNum,
        attrs: match[3],
      });
    }

    CLOSING_BLOCK_RE.lastIndex = 0;
    while ((match = CLOSING_BLOCK_RE.exec(line)) !== null) {
      const alreadyMatchedAsOpening = delimiters.some(
        (d) => d.line === lineNum && d.name === match![1] && !d.closing
      );
      if (!alreadyMatchedAsOpening) {
        delimiters.push({
          name: match[1],
          selfClosing: false,
          closing: true,
          line: lineNum,
        });
      }
    }
  }

  return delimiters;
}

export function validateBlockMarkup(content: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const delimiters = parseDelimiters(content);

  for (const d of delimiters) {
    const blockSlug = d.name.replace(/^core\//, "");

    if (blockSlug === "html" || d.name === "html") {
      errors.push({
        type: "forbidden-block",
        message: `wp:html (Custom HTML) block is not allowed`,
        line: d.line,
        block: d.name,
      });
    }

    if (!d.closing && !CORE_BLOCK_NAMES.has(blockSlug)) {
      const isNamespaced = d.name.includes("/");
      if (isNamespaced) {
        const slug = d.name.split("/")[1];
        if (!CORE_BLOCK_NAMES.has(slug)) {
          warnings.push({
            type: "unknown-block",
            message: `Block "${d.name}" is not in the core whitelist`,
            line: d.line,
            block: d.name,
          });
        }
      } else {
        warnings.push({
          type: "unknown-block",
          message: `Block "wp:${d.name}" is not in the core whitelist`,
          line: d.line,
          block: d.name,
        });
      }
    }

    if (!d.closing && d.attrs) {
      try {
        JSON.parse(d.attrs);
      } catch {
        errors.push({
          type: "invalid-json",
          message: `Invalid JSON attributes in wp:${d.name}`,
          line: d.line,
          block: d.name,
        });
      }
    }
  }

  const stack: BlockDelimiter[] = [];
  for (const d of delimiters) {
    if (d.selfClosing) continue;
    if (!d.closing) {
      stack.push(d);
    } else {
      const last = stack[stack.length - 1];
      if (last && last.name === d.name) {
        stack.pop();
      } else {
        errors.push({
          type: "mismatched-delimiter",
          message: last
            ? `Closing "wp:${d.name}" at line ${d.line} does not match opening "wp:${last.name}" at line ${last.line}`
            : `Closing "wp:${d.name}" at line ${d.line} has no matching opening delimiter`,
          line: d.line,
          block: d.name,
        });
        if (last) {
          stack.pop();
        }
      }
    }
  }

  for (const unclosed of stack) {
    errors.push({
      type: "unclosed-block",
      message: `Block "wp:${unclosed.name}" opened at line ${unclosed.line} is never closed`,
      line: unclosed.line,
      block: unclosed.name,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
