export interface PropMapping {
  attr: string;
  type: "string" | "number" | "boolean";
}

export interface WPComponentDef {
  blockName: string;
  selfClosing: boolean;
  propsToAttributes: Record<string, PropMapping | string>;
  innerBlocksAllowed: boolean;
  htmlTag?: string;
  defaultAttributes?: Record<string, unknown>;
}

export const WP_COMPONENTS: ReadonlyMap<string, WPComponentDef> = new Map<string, WPComponentDef>([
  ["TemplatePart", {
    blockName: "core/template-part",
    selfClosing: true,
    propsToAttributes: { slug: "slug", tagName: "tagName" },
    innerBlocksAllowed: false,
  }],

  ["Query", {
    blockName: "core/query",
    selfClosing: false,
    propsToAttributes: {
      perPage: { attr: "query.perPage", type: "number" },
      inherit: { attr: "query.inherit", type: "boolean" },
      postType: { attr: "query.postType", type: "string" },
      order: { attr: "query.order", type: "string" },
      orderBy: { attr: "query.orderBy", type: "string" },
    },
    innerBlocksAllowed: true,
    htmlTag: "div",
    defaultAttributes: {
      queryId: 0,
      query: {
        perPage: 10,
        pages: 0,
        offset: 0,
        postType: "post",
        order: "desc",
        orderBy: "date",
        inherit: true,
      },
    },
  }],

  ["PostTemplate", {
    blockName: "core/post-template",
    selfClosing: false,
    propsToAttributes: {},
    innerBlocksAllowed: true,
  }],

  ["PostTitle", {
    blockName: "core/post-title",
    selfClosing: true,
    propsToAttributes: {
      isLink: { attr: "isLink", type: "boolean" },
      level: { attr: "level", type: "number" },
    },
    innerBlocksAllowed: false,
  }],

  ["PostDate", {
    blockName: "core/post-date",
    selfClosing: true,
    propsToAttributes: {},
    innerBlocksAllowed: false,
  }],

  ["PostExcerpt", {
    blockName: "core/post-excerpt",
    selfClosing: true,
    propsToAttributes: {},
    innerBlocksAllowed: false,
  }],

  ["PostContent", {
    blockName: "core/post-content",
    selfClosing: true,
    propsToAttributes: {},
    innerBlocksAllowed: false,
  }],

  ["PostFeaturedImage", {
    blockName: "core/post-featured-image",
    selfClosing: true,
    propsToAttributes: {
      isLink: { attr: "isLink", type: "boolean" },
      align: "align",
    },
    innerBlocksAllowed: false,
  }],

  ["Navigation", {
    blockName: "core/navigation",
    selfClosing: true,
    propsToAttributes: {
      layout: "layout",
    },
    innerBlocksAllowed: true,
  }],

  ["SiteTitle", {
    blockName: "core/site-title",
    selfClosing: true,
    propsToAttributes: {
      level: { attr: "level", type: "number" },
    },
    innerBlocksAllowed: false,
  }],

  ["SiteLogo", {
    blockName: "core/site-logo",
    selfClosing: true,
    propsToAttributes: {
      width: { attr: "width", type: "number" },
    },
    innerBlocksAllowed: false,
  }],

  ["Search", {
    blockName: "core/search",
    selfClosing: true,
    propsToAttributes: {
      showLabel: { attr: "showLabel", type: "boolean" },
      buttonText: "buttonText",
      placeholder: "placeholder",
    },
    innerBlocksAllowed: false,
  }],

  ["QueryPagination", {
    blockName: "core/query-pagination",
    selfClosing: false,
    propsToAttributes: {},
    innerBlocksAllowed: true,
    htmlTag: "div",
  }],

  ["QueryNoResults", {
    blockName: "core/query-no-results",
    selfClosing: false,
    propsToAttributes: {},
    innerBlocksAllowed: true,
  }],

  ["Spacer", {
    blockName: "core/spacer",
    selfClosing: false,
    propsToAttributes: {
      height: "height",
    },
    innerBlocksAllowed: false,
    htmlTag: "div",
  }],

  ["Separator", {
    blockName: "core/separator",
    selfClosing: false,
    propsToAttributes: {},
    innerBlocksAllowed: false,
    htmlTag: "hr",
  }],

  ["Buttons", {
    blockName: "core/buttons",
    selfClosing: false,
    propsToAttributes: {
      layout: "layout",
    },
    innerBlocksAllowed: true,
    htmlTag: "div",
  }],

  ["Button", {
    blockName: "core/button",
    selfClosing: false,
    propsToAttributes: {
      url: "url",
      className: "className",
      backgroundColor: "backgroundColor",
      textColor: "textColor",
    },
    innerBlocksAllowed: false,
    htmlTag: "div",
  }],
]);

export function getComponentDef(tagName: string): WPComponentDef | undefined {
  return WP_COMPONENTS.get(tagName);
}

export function isWPComponent(tagName: string): boolean {
  return WP_COMPONENTS.has(tagName);
}
