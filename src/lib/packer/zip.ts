import JSZip from "jszip";
import {
  type ThemeMeta,
  generateStyleCss,
  generateFunctionsPHP,
  generateReadmeTxt,
} from "./constants";

export interface ThemeFiles {
  themeJson: string;
  darkMode: string;
  templates: Map<string, string>;
  parts: Map<string, string>;
  patterns: Map<string, string>;
  meta: ThemeMeta;
  customCss?: string;
}

export async function packageTheme(themeFiles: ThemeFiles): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder(themeFiles.meta.slug)!;

  root.file("style.css", generateStyleCss(themeFiles.meta));
  root.file("theme.json", themeFiles.themeJson);
  root.file("functions.php", generateFunctionsPHP(themeFiles.meta));
  root.file("README.txt", generateReadmeTxt(themeFiles.meta));

  const templatesDir = root.folder("templates")!;
  for (const [name, content] of themeFiles.templates) {
    templatesDir.file(name, content);
  }

  const partsDir = root.folder("parts")!;
  for (const [name, content] of themeFiles.parts) {
    partsDir.file(name, content);
  }

  const patternsDir = root.folder("patterns")!;
  for (const [name, content] of themeFiles.patterns) {
    patternsDir.file(name, content);
  }

  const stylesDir = root.folder("styles")!;
  stylesDir.file("dark.json", themeFiles.darkMode);

  if (themeFiles.customCss) {
    const cssDir = root.folder("assets")!.folder("css")!;
    cssDir.file("saas-sections.css", themeFiles.customCss);
  }

  return zip.generateAsync({ type: "blob" });
}
