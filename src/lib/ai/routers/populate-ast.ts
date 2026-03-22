import { z } from "zod";
import { getProvider } from "@/lib/ai";
import { applyAstMutation, type EditIntent } from "@/lib/transpiler/ast-mutator";

const populateAstSchema = z.object({
  edits: z.array(z.object({
    kind: z.literal("text"),
    uid: z.string().describe("The data-uid of the element to modify."),
    textContent: z.string().describe("The new text content."),
  }))
});

export async function populateReactPages(description: string, rawPages: Record<string, string>): Promise<Record<string, string>> {
  const provider = getProvider();
  
  const systemPrompt = `You are a content injection engine for React templates.
Your goal is to replace the generic placeholder text in the provided React JSX templates with compelling, professional copy tailored strictly to the user's prompt.

You will receive the JSX templates. They have specific "data-uid" attributes on key editable text elements.
Return a list of strictly text-based edits containing the exact data-uid and the new text content for that element.

RULES:
1. ONLY return edits for elements that actually have a data-uid attribute in the provided source.
2. Keep text lengths roughly similar to the original to prevent layout breakage.
3. Write compelling copy that perfectly addresses the user's request.`;

  let sourceContext = "";
  for (const [slug, source] of Object.entries(rawPages)) {
     sourceContext += `\\n--- ${slug}.tsx ---\\n\`\`\`tsx\\n${source}\\n\`\`\`\\n`;
  }

  const prompt = `User Request: "${description}"\\n\\nTemplates:\\n${sourceContext}\\n\\nGenerate the text replacements for these templates based on the user request.`;

  try {
    const result = await provider.generateJSON(prompt, systemPrompt, populateAstSchema, { temperature: 0.5 });
    
    // Convert to the exact EditIntent interface expected by applyAstMutation
    const intents: EditIntent[] = result.edits.map(e => ({
       kind: "text" as const,
       uid: e.uid,
       textContent: e.textContent
    }));

    const newPages: Record<string, string> = {};
    for (const [slug, source] of Object.entries(rawPages)) {
       newPages[slug] = applyAstMutation(source, intents);
    }
    return newPages;

  } catch (err) {
    console.error("AST Populating failed, returning original JSX", err);
    return rawPages;
  }
}
