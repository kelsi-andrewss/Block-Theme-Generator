import { NextResponse } from "next/server";
import { packageTheme } from "@/lib/packer/zip";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { themeFiles, meta } = body as {
      themeFiles: {
        themeJson: string;
        darkMode: string;
        templates: Record<string, string>;
        parts: Record<string, string>;
        patterns: Record<string, string>;
        customCss?: string;
      };
      meta: {
        themeName: string;
        displayName: string;
        description: string;
      };
    };

    const zipBlob = await packageTheme({
      themeJson: themeFiles.themeJson,
      darkMode: themeFiles.darkMode,
      templates: new Map(Object.entries(themeFiles.templates)),
      parts: new Map(Object.entries(themeFiles.parts)),
      patterns: new Map(Object.entries(themeFiles.patterns)),
      customCss: themeFiles.customCss,
      meta: {
        name: meta.displayName,
        slug: meta.themeName,
        description: meta.description,
        version: "1.0.0",
      },
    });

    const arrayBuffer = await zipBlob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${meta.themeName}.zip"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Packaging failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
