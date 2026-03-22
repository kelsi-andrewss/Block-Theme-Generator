"use client";

import { useState, useEffect, useMemo, createElement, Fragment } from "react";
import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { WP_COMPONENTS } from "@/lib/transpiler/wp-components";

interface JsxStringRendererProps {
  jsxString: string;
  cssVars?: Record<string, string>;
}

const VAR_BRIDGE: Record<string, string> = {
  "--wp--preset--color--primary": "var(--color-primary-500)",
  "--wp--preset--color--secondary": "var(--color-secondary-500)",
  "--wp--preset--color--contrast": "var(--color-text)",
  "--wp--preset--color--base": "var(--color-bg)",
};

function parseJsxString(jsxString: string): t.File | null {
  try {
    return parse(jsxString, { sourceType: "module", plugins: ["jsx"] });
  } catch {
    return null;
  }
}

function parseStyleString(styleStr: string): Record<string, string> {
  const styleObj: Record<string, string> = {};
  styleStr.split(';').forEach(rule => {
    const splitIndex = rule.indexOf(':');
    if (splitIndex !== -1) {
      let key = rule.slice(0, splitIndex).trim();
      if (!key.startsWith('--')) {
        key = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      }
      const value = rule.slice(splitIndex + 1).trim();
      if (key && value) {
        styleObj[key] = value;
      }
    }
  });
  return styleObj;
}

function resolveTag(tagName: string): string {
  const isUppercase =
    tagName[0] === tagName[0].toUpperCase() &&
    tagName[0] !== tagName[0].toLowerCase();
  if (!isUppercase) return tagName;
  const def = WP_COMPONENTS.get(tagName);
  return def?.htmlTag ?? "div";
}

function evaluateValue(node: t.Node): unknown {
  if (t.isStringLiteral(node)) return node.value;
  if (t.isNumericLiteral(node)) return node.value;
  if (t.isBooleanLiteral(node)) return node.value;
  if (t.isNullLiteral(node)) return null;
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    return node.quasis.map((q) => q.value.cooked ?? q.value.raw).join("");
  }
  if (t.isUnaryExpression(node) && node.operator === "-" && t.isNumericLiteral(node.argument)) {
    return -node.argument.value;
  }
  if (t.isObjectExpression(node)) {
    const obj: Record<string, unknown> = {};
    for (const prop of node.properties) {
      if (!t.isObjectProperty(prop)) continue;
      const key = t.isIdentifier(prop.key)
        ? prop.key.name
        : t.isStringLiteral(prop.key)
          ? prop.key.value
          : null;
      if (key !== null) {
        obj[key] = evaluateValue(prop.value);
      }
    }
    return obj;
  }
  return undefined;
}

function extractPropsFromAST(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[],
): Record<string, unknown> {
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
      if (t.isJSXEmptyExpression(attr.value.expression)) continue;
      const val = evaluateValue(attr.value.expression);
      if (val !== undefined) props[name] = val;
    }
  }
  return props;
}

function isHtmlString(s: string): boolean {
  return /<[a-zA-Z][\s\S]*?>/.test(s);
}

function unescapeQuotes(s: string): string {
  return s.replace(/\\"/g, '"');
}

let keyCounter = 0;

function generateUid(tag: string, pathId: string): string {
  return `${tag}-${pathId}`;
}

function mapChildrenWithIndex(
  children: t.Node[],
  pathId: string,
): React.ReactNode[] {
  let elementIndex = 0;
  return children
    .map((c) => {
      if (t.isJSXElement(c)) {
        return astToReact(c, `${pathId}.${elementIndex++}`);
      }
      if (t.isJSXExpressionContainer(c)) {
        const isHtmlExpr = (() => {
          if (t.isJSXEmptyExpression(c.expression)) return false;
          let str: string | null = null;
          if (t.isStringLiteral(c.expression)) str = c.expression.value;
          else if (t.isTemplateLiteral(c.expression) && c.expression.expressions.length === 0) {
            str = c.expression.quasis.map((q) => q.value.cooked ?? q.value.raw).join("");
          }
          return str !== null && isHtmlString(str);
        })();
        if (isHtmlExpr) {
          return astToReact(c, `${pathId}.${elementIndex++}`);
        }
      }
      return astToReact(c, `${pathId}.X`); // Dummy path for non-elements to satisfy signature
    })
    .filter((c) => c !== null && c !== undefined && c !== "");
}

function astToReact(node: t.Node, pathId: string = "0"): React.ReactNode {
  if (t.isJSXFragment(node)) {
    const children = mapChildrenWithIndex(node.children, pathId);
    return createElement(Fragment, null, ...children);
  }

  if (t.isJSXText(node)) {
    const text = node.value.replace(/\n\s*/g, " ").trim();
    return text || null;
  }

  if (t.isJSXExpressionContainer(node)) {
    if (t.isJSXEmptyExpression(node.expression)) return null;

    let str: string | null = null;
    if (t.isStringLiteral(node.expression)) {
      str = node.expression.value;
    } else if (
      t.isTemplateLiteral(node.expression) &&
      node.expression.expressions.length === 0
    ) {
      str = node.expression.quasis
        .map((q) => q.value.cooked ?? q.value.raw)
        .join("");
    }

    if (str !== null) {
      if (isHtmlString(str)) {
        return createElement("span", {
          key: `html-${++keyCounter}`,
          dangerouslySetInnerHTML: { __html: unescapeQuotes(str) },
        });
      }
      return str;
    }

    return null;
  }

  if (!t.isJSXElement(node)) return null;

  const opening = node.openingElement;
  let tagName: string;
  if (t.isJSXIdentifier(opening.name)) {
    tagName = opening.name.name;
  } else if (t.isJSXMemberExpression(opening.name)) {
    tagName = "div";
  } else {
    tagName = "div";
  }

  const resolved = resolveTag(tagName);
  const rawProps = extractPropsFromAST(opening.attributes);

  const reactProps: Record<string, unknown> = {
    key: `el-${++keyCounter}`,
  };

  for (const [key, value] of Object.entries(rawProps)) {
    if (key === "style") {
      if (typeof value === "object" && value !== null) {
        reactProps.style = value;
      } else if (typeof value === "string") {
        reactProps.style = parseStyleString(value);
      }
      continue;
    }
    if (key === "className") {
      reactProps.className = value;
      continue;
    }
    if (key === "htmlFor") {
      reactProps.htmlFor = value;
      continue;
    }
    // Map HTML attributes to their React equivalents
    if (key === "class") {
      reactProps.className = value;
      continue;
    }
    if (key === "for") {
      reactProps.htmlFor = value;
      continue;
    }
    // Pass through standard HTML attributes
    reactProps[key] = value;
  }

  if (!rawProps["data-uid"]) {
    reactProps["data-uid"] = generateUid(resolved, pathId);
  }

  const children = mapChildrenWithIndex(node.children, pathId);

  if (children.length === 0) {
    return createElement(resolved, reactProps);
  }
  return createElement(resolved, reactProps, ...children);
}

export default function JsxStringRenderer({
  jsxString,
  cssVars,
}: JsxStringRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rendered = useMemo(() => {
    if (!mounted) return null;

    // Reset key counter for each parse
    keyCounter = 0;

    const ast = parseJsxString(jsxString);
    if (!ast) {
      return createElement(
        "div",
        {
          style: {
            padding: "1rem",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
          },
        },
        "Failed to parse JSX string",
      );
    }

    const body = ast.program.body;
    if (body.length === 0) return null;

    const stmt = body[0];
    if (t.isExpressionStatement(stmt)) {
      return astToReact(stmt.expression);
    }

    return null;
  }, [jsxString, mounted]);

  if (!mounted) return null;

  const bridgeStyle: Record<string, string> = { ...VAR_BRIDGE };
  if (cssVars) {
    Object.assign(bridgeStyle, cssVars);
  }

  return createElement("div", { style: bridgeStyle }, rendered);
}
