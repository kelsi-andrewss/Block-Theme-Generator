import { z } from "zod";
import { getProvider } from "@/lib/ai";

const populateSchema = z.object({
  replacements: z.array(z.object({
    originalText: z.string().describe("The exact partial string or full text from the original template to replace. Case-sensitive."),
    newText: z.string().describe("The new text injected based on the user's prompt.")
  })),
  imageReplacements: z.array(z.object({
    uid: z.string().describe("The data-uid of the image to replace, or a unique alt/src identifier if uid is missing."),
    newSrc: z.string().describe("The Unsplash source URL for the new image.")
  })).optional()
});

export type PopulateResult = z.infer<typeof populateSchema>;

export async function populateSlots(templateHtml: string, description: string): Promise<string> {
  const provider = getProvider();
  
  const systemPrompt = `You are a content injection engine for WordPress block templates.
Your goal is to replace the generic placeholder text and images in the provided HTML structure with appropriate content tailored to the user's prompt.

You will receive the full HTML template.
Return a list of exact text strings to replace. Use the exact wording found in the HTML so a simple string replace can be used.

For images, provide the data-uid of the image block (if available, otherwise the current src) and a new src URL. Use 'https://source.unsplash.com/random/800x600/?<keyword>' for new image sources, replacing <keyword> with something relevant.

RULES:
1. Do NOT change any HTML structure or class names.
2. Keep text lengths roughly similar to the original to prevent layout breakage.
3. originalText must vividly match a chunk of text in the provided HTML. Do NOT include HTML tags in originalText, only the inner text.`;

  const prompt = `Template HTML:
\`\`\`html
${templateHtml}
\`\`\`

User Request: "${description}"

Generate the replacements for this template.`;

  try {
    const result = await provider.generateJSON(prompt, systemPrompt, populateSchema, { temperature: 0.4 });
    let finalHtml = templateHtml;
    
    // Perform robust text replacement
    for (const rep of result.replacements) {
      if (rep.originalText && rep.newText) {
        // Escape special regex chars for safety
        const safeOriginal = rep.originalText.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
        finalHtml = finalHtml.replace(new RegExp(safeOriginal, 'g'), rep.newText);
      }
    }

    if (result.imageReplacements) {
      for (const imgRep of result.imageReplacements) {
        if (imgRep.uid && imgRep.newSrc) {
          // If uid matches a data-uid, replace its sibling src attribute
          const uidRegex = new RegExp(`(data-uid="${imgRep.uid}"[^>]*src=")([^"]+)(")`, 'g');
          if (uidRegex.test(finalHtml)) {
             finalHtml = finalHtml.replace(uidRegex, `$1${imgRep.newSrc}$3`);
          } else {
             // Fallback: if they just provided the old src in the uid field
             const safeSrc = imgRep.uid.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
             finalHtml = finalHtml.replace(new RegExp(safeSrc, 'g'), imgRep.newSrc);
          }
        }
      }
    }

    return finalHtml;
  } catch (err) {
    console.error("Populate slots failed, returning original markup", err);
    return templateHtml;
  }
}
