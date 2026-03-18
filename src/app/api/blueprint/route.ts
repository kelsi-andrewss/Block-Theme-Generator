import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zipBase64, meta } = body as {
      zipBase64: string;
      meta: {
        themeName: string;
      };
    };

    if (!zipBase64 || !meta?.themeName) {
      return NextResponse.json({ error: "Missing zipBase64 or theme metadata" }, { status: 400 });
    }

    const slug = meta.themeName;

    const blueprint = {
      $schema: "https://playground.wordpress.net/blueprint-schema.json",
      landingPage: "/",
      preferredVersions: {
        php: "8.2",
        wp: "latest"
      },
      steps: [
        {
          step: "login",
          username: "admin",
          password: "password"
        },
        {
          step: "installTheme",
          themeData: {
            resource: "bundled",
            path: "theme.zip"
          }
        },
        {
          step: "setSiteOptions",
          options: {
            stylesheet: slug,
            template: slug
          }
        }
      ]
    };

    // WordPress Playground supports "Blueprint Bundles" (.zip files containing blueprint.json at the root)
    const bundleZip = new JSZip();
    bundleZip.file("blueprint.json", JSON.stringify(blueprint));
    bundleZip.file("theme.zip", Buffer.from(zipBase64, "base64"));

    // The entire bundle is generated as a base64 string
    const bundleBase64 = await bundleZip.generateAsync({ type: "base64" });

    return NextResponse.json({ bundleBase64 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Blueprint generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
