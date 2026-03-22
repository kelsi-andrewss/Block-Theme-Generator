import { z } from "zod";

const FontFaceSchema = z
  .object({
    fontFamily: z.string(),
    fontWeight: z.string(),
    fontStyle: z.string(),
    fontStretch: z.string().optional(),
    src: z.array(z.string()),
  })
  .passthrough();

const FontFamilySchema = z
  .object({
    fontFamily: z.string(),
    name: z.string(),
    slug: z.string(),
    fontFace: z.array(FontFaceSchema).optional(),
  })
  .passthrough();

const FontSizeSchema = z
  .object({
    size: z.string(),
    slug: z.string(),
    name: z.string(),
    fluid: z
      .union([
        z.boolean(),
        z.object({ min: z.string(), max: z.string() }),
      ])
      .optional(),
  })
  .passthrough();

const PaletteColorSchema = z
  .object({
    slug: z.string(),
    color: z.string(),
    name: z.string(),
  })
  .passthrough();

const SpacingSizeSchema = z
  .object({
    size: z.string(),
    slug: z.string(),
    name: z.string(),
  })
  .passthrough();

const LayoutSchema = z
  .object({
    contentSize: z.string(),
    wideSize: z.string(),
  })
  .passthrough();

const ElementStyleSchema = z
  .object({
    color: z
      .object({ text: z.string().optional(), background: z.string().optional() })
      .passthrough()
      .optional(),
    typography: z
      .object({
        fontFamily: z.string().optional(),
        fontSize: z.string().optional(),
        fontWeight: z.string().optional(),
        lineHeight: z.string().optional(),
        textDecoration: z.string().optional(),
      })
      .passthrough()
      .optional(),
    spacing: z.record(z.unknown()).optional(),
  })
  .passthrough();

const BlockStyleSchema = z.record(z.unknown());

const TemplatePartSchema = z.object({
  area: z.string(),
  name: z.string(),
  title: z.string(),
});

const CustomTemplateSchema = z
  .object({
    name: z.string(),
    title: z.string(),
    postTypes: z.array(z.string()).optional(),
  })
  .passthrough();

export const ThemeJsonSchema = z
  .object({
    version: z.literal(3),
    settings: z
      .object({
        color: z
          .object({
            palette: z.array(PaletteColorSchema),
            defaultPalette: z.literal(false).optional(),
          })
          .passthrough(),
        typography: z
          .object({
            fontFamilies: z.array(FontFamilySchema),
            fontSizes: z.array(FontSizeSchema),
            defaultFontSizes: z.literal(false).optional(),
          })
          .passthrough(),
        spacing: z
          .object({
            spacingSizes: z.array(SpacingSizeSchema),
            defaultSpacingSizes: z.literal(false).optional(),
          })
          .passthrough(),
        layout: LayoutSchema,
        appearanceTools: z.literal(true),
      })
      .passthrough(),
    styles: z
      .object({
        color: z.object({
          background: z.string(),
          text: z.string(),
        }),
        typography: z.object({
          fontFamily: z.string(),
          fontSize: z.string(),
          lineHeight: z.string(),
        }),
        elements: z.record(z.string(), ElementStyleSchema).optional(),
        blocks: z.record(z.string(), BlockStyleSchema).optional(),
      })
      .passthrough(),
    templateParts: z.array(TemplatePartSchema),
    customTemplates: z.array(CustomTemplateSchema).optional(),
  })
  .passthrough();

export type ThemeJson = z.infer<typeof ThemeJsonSchema>;

export const DarkModeSchema = z
  .object({
    version: z.literal(3),
    title: z.string().optional(),
    settings: z
      .object({
        color: z
          .object({
            palette: z.array(PaletteColorSchema),
          })
          .passthrough(),
      })
      .passthrough(),
    styles: z
      .object({
        color: z.object({
          background: z.string(),
          text: z.string(),
        }),
        elements: z.record(z.string(), ElementStyleSchema).optional(),
        blocks: z.record(z.string(), BlockStyleSchema).optional(),
      })
      .passthrough(),
  })
  .passthrough();

export type DarkModeStyles = z.infer<typeof DarkModeSchema>;
