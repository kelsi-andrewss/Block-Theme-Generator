export interface AuditCheck {
  name: string;
  passed: boolean;
  severity: "error" | "warning" | "info";
  message: string;
  details?: string;
}

export interface AuditResult {
  score: number;
  checks: AuditCheck[];
  grade: "A" | "B" | "C" | "D" | "F";
}

interface PaletteEntry {
  slug: string;
  color: string;
  name?: string;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace(/^#/, "");
  const full =
    cleaned.length === 3
      ? cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2]
      : cleaned;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function linearize(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function resolveColorValue(
  value: string,
  palette: PaletteEntry[]
): string | null {
  if (!value) return null;

  if (value.startsWith("#")) return value;

  const presetMatch = value.match(/^var:preset\|color\|(.+)$/);
  if (presetMatch) {
    const slug = presetMatch[1];
    const entry = palette.find((p) => p.slug === slug);
    return entry?.color ?? null;
  }

  return null;
}

function parsePxOrRem(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "number") return value;
  const pxMatch = value.match(/^([\d.]+)\s*px$/);
  if (pxMatch) return parseFloat(pxMatch[1]);
  const remMatch = value.match(/^([\d.]+)\s*rem$/);
  if (remMatch) return parseFloat(remMatch[1]) * 16;
  const num = parseFloat(value);
  if (!isNaN(num)) return num;
  return null;
}

function parseLineHeight(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "number") return value;
  const num = parseFloat(value);
  if (!isNaN(num)) return num;
  return null;
}

function computeGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function auditThemeDesign(themeJson: any): AuditResult {
  const checks: AuditCheck[] = [];
  let score = 100;

  const palette: PaletteEntry[] =
    themeJson?.settings?.color?.palette ?? [];
  const fontSizes: Array<{ slug: string; size: string | number; name?: string }> =
    themeJson?.settings?.typography?.fontSizes ?? [];
  const spacingSizes: Array<{ slug: string; size: string | number; name?: string }> =
    themeJson?.settings?.spacing?.spacingSizes ?? [];
  const styles = themeJson?.styles ?? {};
  const layout = themeJson?.settings?.layout ?? {};

  // --- Contrast check ---
  const textColor = styles?.color?.text;
  const bgColor = styles?.color?.background;
  if (textColor && bgColor) {
    const resolvedText = resolveColorValue(textColor, palette);
    const resolvedBg = resolveColorValue(bgColor, palette);
    if (resolvedText && resolvedBg) {
      const ratio = getContrastRatio(resolvedText, resolvedBg);
      const passed = ratio >= 4.5;
      checks.push({
        name: "contrast-body",
        passed,
        severity: passed ? "info" : "error",
        message: passed
          ? `Body text contrast ratio ${ratio.toFixed(2)}:1 meets WCAG AA`
          : `Body text contrast ratio ${ratio.toFixed(2)}:1 fails WCAG AA (minimum 4.5:1)`,
        details: `text: ${resolvedText}, background: ${resolvedBg}`,
      });
      if (!passed) score -= 20;
    }
  }

  const headingTextColor = styles?.elements?.heading?.color?.text;
  const headingBgColor = styles?.elements?.heading?.color?.background ?? bgColor;
  if (headingTextColor && headingBgColor) {
    const resolvedText = resolveColorValue(headingTextColor, palette);
    const resolvedBg = resolveColorValue(headingBgColor, palette);
    if (resolvedText && resolvedBg) {
      const ratio = getContrastRatio(resolvedText, resolvedBg);
      const passed = ratio >= 4.5;
      checks.push({
        name: "contrast-heading",
        passed,
        severity: passed ? "info" : "error",
        message: passed
          ? `Heading contrast ratio ${ratio.toFixed(2)}:1 meets WCAG AA`
          : `Heading contrast ratio ${ratio.toFixed(2)}:1 fails WCAG AA (minimum 4.5:1)`,
        details: `text: ${resolvedText}, background: ${resolvedBg}`,
      });
      if (!passed) score -= 20;
    }
  }

  const linkColor = styles?.elements?.link?.color?.text;
  if (linkColor && bgColor) {
    const resolvedLink = resolveColorValue(linkColor, palette);
    const resolvedBg = resolveColorValue(bgColor, palette);
    if (resolvedLink && resolvedBg) {
      const ratio = getContrastRatio(resolvedLink, resolvedBg);
      const passed = ratio >= 4.5;
      checks.push({
        name: "contrast-link",
        passed,
        severity: passed ? "info" : "error",
        message: passed
          ? `Link contrast ratio ${ratio.toFixed(2)}:1 meets WCAG AA`
          : `Link contrast ratio ${ratio.toFixed(2)}:1 fails WCAG AA (minimum 4.5:1)`,
        details: `link: ${resolvedLink}, background: ${resolvedBg}`,
      });
      if (!passed) score -= 20;
    }
  }

  // --- Body font size check ---
  const bodyFontSize = styles?.typography?.fontSize;
  const bodyPx = parsePxOrRem(bodyFontSize);
  if (bodyPx !== null) {
    const passed = bodyPx >= 16;
    checks.push({
      name: "body-font-size",
      passed,
      severity: passed ? "info" : "error",
      message: passed
        ? `Body font size ${bodyPx}px meets minimum (16px)`
        : `Body font size ${bodyPx}px is below minimum (16px)`,
    });
    if (!passed) score -= 10;
  }

  // --- Type scale check ---
  if (fontSizes.length >= 3) {
    const pxSizes = fontSizes
      .map((fs) => parsePxOrRem(fs.size))
      .filter((v): v is number => v !== null)
      .sort((a, b) => a - b);

    if (pxSizes.length >= 3) {
      const ratios: number[] = [];
      for (let i = 1; i < pxSizes.length; i++) {
        ratios.push(pxSizes[i] / pxSizes[i - 1]);
      }
      const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
      const withinRange = avgRatio >= 1.125 && avgRatio <= 1.618;
      const consistent = ratios.every(
        (r) => Math.abs(r - avgRatio) / avgRatio < 0.3
      );
      const passed = withinRange && consistent;
      checks.push({
        name: "type-scale",
        passed,
        severity: passed ? "info" : "warning",
        message: passed
          ? `Type scale ratio ~${avgRatio.toFixed(3)} is within ideal range (1.125-1.618)`
          : `Type scale ratio ~${avgRatio.toFixed(3)} ${!withinRange ? "is outside ideal range (1.125-1.618)" : "is inconsistent across sizes"}`,
        details: `sizes: ${pxSizes.map((s) => s + "px").join(", ")}; ratios: ${ratios.map((r) => r.toFixed(3)).join(", ")}`,
      });
      if (!passed) score -= 10;
    }
  }

  // --- Heading hierarchy check ---
  const headingLevels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
  const headingSizes: Array<{ level: string; px: number }> = [];
  for (const level of headingLevels) {
    const fontSize =
      styles?.elements?.[level]?.typography?.fontSize;
    const px = parsePxOrRem(fontSize);
    if (px !== null) {
      headingSizes.push({ level, px });
    }
  }
  if (headingSizes.length >= 2) {
    let hierarchyValid = true;
    for (let i = 1; i < headingSizes.length; i++) {
      if (headingSizes[i].px >= headingSizes[i - 1].px) {
        hierarchyValid = false;
        break;
      }
    }
    checks.push({
      name: "heading-hierarchy",
      passed: hierarchyValid,
      severity: hierarchyValid ? "info" : "warning",
      message: hierarchyValid
        ? "Heading sizes decrease properly from H1 to H6"
        : "Heading sizes do not consistently decrease from H1 to H6",
      details: headingSizes.map((h) => `${h.level}: ${h.px}px`).join(", "),
    });
    if (!hierarchyValid) score -= 10;
  }

  // --- H1 vs body check ---
  const h1FontSize = styles?.elements?.h1?.typography?.fontSize;
  const h1Px = parsePxOrRem(h1FontSize);
  if (h1Px !== null && bodyPx !== null) {
    const ratio = h1Px / bodyPx;
    const passed = ratio >= 2;
    checks.push({
      name: "h1-vs-body",
      passed,
      severity: passed ? "info" : "warning",
      message: passed
        ? `H1 (${h1Px}px) is ${ratio.toFixed(1)}x body size (${bodyPx}px)`
        : `H1 (${h1Px}px) should be at least 2x body size (${bodyPx}px), currently ${ratio.toFixed(1)}x`,
    });
    if (!passed) score -= 10;
  }

  // --- Line height check ---
  const bodyLineHeight = styles?.typography?.lineHeight;
  const lh = parseLineHeight(bodyLineHeight);
  if (lh !== null) {
    const passed = lh >= 1.4 && lh <= 1.6;
    checks.push({
      name: "body-line-height",
      passed,
      severity: passed ? "info" : "warning",
      message: passed
        ? `Body line height ${lh} is within ideal range (1.4-1.6)`
        : `Body line height ${lh} is outside ideal range (1.4-1.6)`,
    });
    if (!passed) score -= 10;
  }

  // --- Spacing grid check ---
  if (spacingSizes.length > 0) {
    let failCount = 0;
    const nonGridValues: string[] = [];
    for (const sp of spacingSizes) {
      const px = parsePxOrRem(sp.size);
      if (px !== null && px > 0) {
        if (px % 4 !== 0 && px % 8 !== 0) {
          failCount++;
          nonGridValues.push(`${sp.slug}: ${px}px`);
        }
      }
    }
    const passed = failCount === 0;
    checks.push({
      name: "spacing-grid",
      passed,
      severity: passed ? "info" : "warning",
      message: passed
        ? "All spacing values align to 4px or 8px grid"
        : `${failCount} spacing value(s) do not align to 4px or 8px grid`,
      details: nonGridValues.length > 0 ? nonGridValues.join(", ") : undefined,
    });
    score -= failCount * 5;
  }

  // --- Color palette count check ---
  if (palette.length > 0) {
    const uniqueColors = new Set(
      palette.map((p) => p.color.toLowerCase())
    );
    const count = uniqueColors.size;
    const passed = count >= 3 && count <= 15;
    checks.push({
      name: "color-palette-count",
      passed,
      severity: passed ? "info" : "warning",
      message: passed
        ? `Color palette has ${count} unique colors (ideal: 3-15)`
        : `Color palette has ${count} unique colors (ideal: 3-15)`,
    });
    if (!passed) score -= 10;
  }

  // --- Content width check ---
  const contentSize = parsePxOrRem(layout.contentSize);
  const wideSize = parsePxOrRem(layout.wideSize);
  if (contentSize !== null || wideSize !== null) {
    const contentOk = contentSize === null || contentSize <= 1440;
    const wideOk = wideSize === null || wideSize <= 1440;
    const passed = contentOk && wideOk;
    checks.push({
      name: "content-width",
      passed,
      severity: passed ? "info" : "warning",
      message: passed
        ? `Content widths are within 1440px limit`
        : `Content width exceeds 1440px limit${!contentOk ? ` (contentSize: ${contentSize}px)` : ""}${!wideOk ? ` (wideSize: ${wideSize}px)` : ""}`,
    });
    if (!passed) score -= 10;
  }

  score = Math.max(0, score);
  const grade = computeGrade(score);

  return { score, checks, grade };
}
