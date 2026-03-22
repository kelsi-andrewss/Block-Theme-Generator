import { NextResponse } from "next/server";
import { packageThemeFromFileMap } from "@/lib/packer/zip";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileMap, slug } = body as {
      fileMap: Record<string, string>;
      slug: string;
    };

    const zipBlob = await packageThemeFromFileMap(fileMap, slug);
    const arrayBuffer = await zipBlob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}.zip"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Packaging failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
