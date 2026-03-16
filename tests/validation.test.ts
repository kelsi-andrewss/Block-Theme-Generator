import { describe, it, expect } from "vitest";
import { validateBlockMarkup } from "@/lib/validation/block-validator";
import {
  hexToRgb,
  getContrastRatio,
  auditThemeDesign,
} from "@/lib/validation/design-audit";

describe("validateBlockMarkup", () => {
  it("valid simple markup passes with no errors", () => {
    const markup = [
      "<!-- wp:paragraph -->",
      "<p>Hello</p>",
      "<!-- /wp:paragraph -->",
    ].join("\n");
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("valid nested markup passes with no errors", () => {
    const markup = [
      "<!-- wp:group -->",
      '<div class="wp-block-group">',
      "<!-- wp:paragraph -->",
      "<p>Inside group</p>",
      "<!-- /wp:paragraph -->",
      "</div>",
      "<!-- /wp:group -->",
    ].join("\n");
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("valid self-closing block passes with no errors", () => {
    const markup = `<!-- wp:spacer {"height":"50px"} /-->`;
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("mismatched delimiters produce an error", () => {
    const markup = [
      "<!-- wp:paragraph -->",
      "<p>Text</p>",
      "<!-- /wp:heading -->",
    ].join("\n");
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.type === "mismatched-delimiter")).toBe(
      true
    );
  });

  it("wp:html block produces a forbidden-block error", () => {
    const markup = `<!-- wp:html --><div>raw</div><!-- /wp:html -->`;
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.type === "forbidden-block")).toBe(true);
  });

  it("invalid JSON in attributes produces an error", () => {
    const markup = `<!-- wp:paragraph {invalid} --><p>Bad</p><!-- /wp:paragraph -->`;
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.type === "invalid-json")).toBe(true);
  });

  it("unknown block name produces a warning", () => {
    const markup = [
      "<!-- wp:unicorn -->",
      "<p>Magic</p>",
      "<!-- /wp:unicorn -->",
    ].join("\n");
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.type === "unknown-block")).toBe(true);
  });

  it("unclosed block produces an error", () => {
    const markup = `<!-- wp:paragraph --><p>No close</p>`;
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.type === "unclosed-block")).toBe(true);
  });
});

describe("hexToRgb", () => {
  it("#ffffff returns {r: 255, g: 255, b: 255}", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("#000000 returns {r: 0, g: 0, b: 0}", () => {
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("handles shorthand hex (#fff)", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("handles hex without # prefix", () => {
    expect(hexToRgb("ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe("getContrastRatio", () => {
  it("black on white returns 21:1", () => {
    const ratio = getContrastRatio("#000000", "#ffffff");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("same color returns 1:1", () => {
    const ratio = getContrastRatio("#444444", "#444444");
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("is commutative", () => {
    const a = getContrastRatio("#000000", "#ffffff");
    const b = getContrastRatio("#ffffff", "#000000");
    expect(a).toBeCloseTo(b, 5);
  });
});

describe("auditThemeDesign", () => {
  const wellDesignedTheme = {
    settings: {
      color: {
        palette: [
          { slug: "primary", color: "#1a1a2e" },
          { slug: "secondary", color: "#f0efe9" },
          { slug: "accent", color: "#e07a5f" },
          { slug: "base", color: "#fafaf7" },
          { slug: "contrast", color: "#2d2d2d" },
        ],
      },
      typography: {
        fontSizes: [
          { slug: "small", size: "14px", name: "Small" },
          { slug: "medium", size: "18px", name: "Medium" },
          { slug: "large", size: "24px", name: "Large" },
          { slug: "x-large", size: "32px", name: "X-Large" },
          { slug: "xx-large", size: "48px", name: "XX-Large" },
        ],
      },
      spacing: {
        spacingSizes: [
          { slug: "10", size: "8px", name: "Small" },
          { slug: "20", size: "16px", name: "Medium" },
          { slug: "30", size: "24px", name: "Large" },
          { slug: "40", size: "32px", name: "XL" },
          { slug: "50", size: "48px", name: "XXL" },
        ],
      },
      layout: {
        contentSize: "720px",
        wideSize: "1200px",
      },
    },
    styles: {
      color: {
        text: "#2d2d2d",
        background: "#fafaf7",
      },
      typography: {
        fontSize: "18px",
        lineHeight: "1.5",
      },
      elements: {
        heading: {
          color: {
            text: "#1a1a2e",
          },
        },
        link: {
          color: {
            text: "#e07a5f",
          },
        },
        h1: { typography: { fontSize: "48px" } },
        h2: { typography: { fontSize: "36px" } },
        h3: { typography: { fontSize: "28px" } },
      },
    },
  };

  it("well-designed theme scores >= 80", () => {
    const result = auditThemeDesign(wellDesignedTheme);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.grade).toMatch(/^[AB]$/);
  });

  it("white text on white background fails contrast check", () => {
    const badTheme = {
      settings: {
        color: { palette: [] },
      },
      styles: {
        color: {
          text: "#ffffff",
          background: "#ffffff",
        },
      },
    };
    const result = auditThemeDesign(badTheme);
    const contrastCheck = result.checks.find(
      (c) => c.name === "contrast-body"
    );
    expect(contrastCheck).toBeDefined();
    expect(contrastCheck!.passed).toBe(false);
  });

  it("black text on white background passes contrast check", () => {
    const goodTheme = {
      settings: {
        color: { palette: [] },
      },
      styles: {
        color: {
          text: "#000000",
          background: "#ffffff",
        },
      },
    };
    const result = auditThemeDesign(goodTheme);
    const contrastCheck = result.checks.find(
      (c) => c.name === "contrast-body"
    );
    expect(contrastCheck).toBeDefined();
    expect(contrastCheck!.passed).toBe(true);
  });

  it("score deductions are additive", () => {
    const badTheme = {
      settings: {
        color: { palette: [] },
        spacing: {
          spacingSizes: [{ slug: "10", size: "7px", name: "Odd" }],
        },
      },
      styles: {
        color: {
          text: "#ffffff",
          background: "#ffffff",
        },
        typography: {
          fontSize: "12px",
        },
      },
    };
    const result = auditThemeDesign(badTheme);
    // contrast-body fails (-20), body-font-size fails (-10), spacing-grid fails (-5)
    expect(result.score).toBeLessThanOrEqual(65);
  });

  it("body font below 16px fails typography check", () => {
    const theme = {
      settings: { color: { palette: [] } },
      styles: {
        color: { text: "#000", background: "#fff" },
        typography: { fontSize: "12px" },
      },
    };
    const result = auditThemeDesign(theme);
    const fontCheck = result.checks.find((c) => c.name === "body-font-size");
    expect(fontCheck).toBeDefined();
    expect(fontCheck!.passed).toBe(false);
  });

  it("resolves palette preset references for contrast check", () => {
    const theme = {
      settings: {
        color: {
          palette: [
            { slug: "primary", color: "#ffffff" },
            { slug: "bg", color: "#ffffff" },
          ],
        },
      },
      styles: {
        color: {
          text: "var:preset|color|primary",
          background: "var:preset|color|bg",
        },
      },
    };
    const result = auditThemeDesign(theme);
    const contrastCheck = result.checks.find(
      (c) => c.name === "contrast-body"
    );
    expect(contrastCheck).toBeDefined();
    expect(contrastCheck!.passed).toBe(false);
  });
});
