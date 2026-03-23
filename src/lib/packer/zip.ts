import JSZip from "jszip";

export async function packageThemeFromFileMap(
  fileMap: Record<string, string | Blob | ArrayBuffer>,
  slug: string
): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder(slug)!;

  for (const [path, content] of Object.entries(fileMap)) {
    root.file(path, content);
  }

  return zip.generateAsync({ type: "blob" });
}
