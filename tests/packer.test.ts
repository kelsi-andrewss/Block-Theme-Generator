import { describe, it, expect } from "vitest";
import {
  generateStyleCss,
  generateFunctionsPHP,
  generateReadmeTxt,
  type ThemeMeta,
} from "@/lib/packer/constants";

const baseMeta: ThemeMeta = {
  name: "Test Theme",
  slug: "test-theme",
  description: "A theme for testing",
  version: "1.0.0",
};

describe("generateStyleCss", () => {
  it("contains Theme Name with the provided name", () => {
    const css = generateStyleCss(baseMeta);
    expect(css).toContain("Theme Name: Test Theme");
  });

  it("contains Text Domain with the slug", () => {
    const css = generateStyleCss(baseMeta);
    expect(css).toContain("Text Domain: test-theme");
  });

  it("contains Version with the version", () => {
    const css = generateStyleCss(baseMeta);
    expect(css).toContain("Version: 1.0.0");
  });

  it("contains Description", () => {
    const css = generateStyleCss(baseMeta);
    expect(css).toContain("Description: A theme for testing");
  });

  it("is wrapped in a CSS comment", () => {
    const css = generateStyleCss(baseMeta);
    expect(css).toMatch(/^\/\*/);
    expect(css).toContain("*/");
  });
});

describe("generateFunctionsPHP", () => {
  it("contains wp-block-styles support", () => {
    const php = generateFunctionsPHP(baseMeta);
    expect(php).toContain("wp-block-styles");
  });

  it("starts with PHP opening tag", () => {
    const php = generateFunctionsPHP(baseMeta);
    expect(php).toMatch(/^<\?php/);
  });

  it("with fonts: contains wp_enqueue_style for Google Fonts", () => {
    const meta: ThemeMeta = {
      ...baseMeta,
      fontFamilies: ["Playfair Display", "Source Sans 3"],
    };
    const php = generateFunctionsPHP(meta);
    expect(php).toContain("wp_enqueue_style");
    expect(php).toContain("fonts.googleapis.com");
    expect(php).toContain("Playfair+Display");
    expect(php).toContain("Source+Sans+3");
  });

  it("without fonts: does NOT contain wp_enqueue_style", () => {
    const php = generateFunctionsPHP(baseMeta);
    expect(php).not.toContain("wp_enqueue_style");
  });

  it("with only system fonts: does NOT enqueue Google Fonts", () => {
    const meta: ThemeMeta = {
      ...baseMeta,
      fontFamilies: ["Arial", "Georgia"],
    };
    const php = generateFunctionsPHP(meta);
    expect(php).not.toContain("wp_enqueue_style");
    expect(php).not.toContain("fonts.googleapis.com");
  });

  it("uses theme slug in enqueue handle", () => {
    const meta: ThemeMeta = {
      ...baseMeta,
      slug: "my-custom-theme",
      fontFamilies: ["Inter"],
    };
    const php = generateFunctionsPHP(meta);
    expect(php).toContain("my-custom-theme-google-fonts");
  });
});

describe("generateReadmeTxt", () => {
  it("contains the theme name", () => {
    const txt = generateReadmeTxt(baseMeta);
    expect(txt).toContain("=== Test Theme ===");
  });

  it("contains the description", () => {
    const txt = generateReadmeTxt(baseMeta);
    expect(txt).toContain("A theme for testing");
  });

  it("contains installation instructions", () => {
    const txt = generateReadmeTxt(baseMeta);
    expect(txt).toContain("Installation");
    expect(txt).toContain("Upload the ZIP file");
  });
});
