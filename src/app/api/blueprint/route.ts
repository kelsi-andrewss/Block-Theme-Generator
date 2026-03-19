import { NextResponse } from "next/server";
import JSZip from "jszip";
import { buildEnhancedBlueprint } from "@/lib/playground/blueprint-builder";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zipBase64, meta, archetypeId, templateMarkup } = body as {
      zipBase64: string;
      meta: { themeName: string };
      archetypeId?: string;
      templateMarkup?: string;
    };

    if (!zipBase64 || !meta?.themeName) {
      return NextResponse.json({ error: "Missing zipBase64 or theme metadata" }, { status: 400 });
    }

    const blueprint = buildEnhancedBlueprint(
      meta.themeName,
      archetypeId ?? "blog",
      templateMarkup ?? ""
    );

    const bundleZip = new JSZip();
    bundleZip.file("blueprint.json", JSON.stringify(blueprint));
    bundleZip.file("theme.zip", Buffer.from(zipBase64, "base64"));

    const bundleBase64 = await bundleZip.generateAsync({ type: "base64" });

    return NextResponse.json({ bundleBase64 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Blueprint generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
