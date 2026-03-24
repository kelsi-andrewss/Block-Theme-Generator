import { z } from "zod";
import { getProvider } from "@/lib/ai";

const intentSchema = z.object({
  templateId: z.enum(["saas", "blog", "portfolio", "ecommerce", "local-business"]).describe("The ID of the pre-built template that best matches the user's request. If no specific match, use 'local-business'."),
  explanation: z.string().describe("A one sentence explanation of why this template was chosen.")
});

export type IntentResult = z.infer<typeof intentSchema>;

export async function classifyIntent(description: string): Promise<IntentResult> {
  const provider = getProvider();
  
  const systemPrompt = `You are a specialized website template router.
Your job is to read a user's request for a website and map it closely to one of our available pre-designed templates.

Available templates:
1. "saas" - For software, apps, B2B services, startups, and marketing landing pages.
2. "blog" - For writers, publications, news, and magazines.
3. "portfolio" - For designers, agencies, artists, and personal sites.
4. "ecommerce" - For online stores, shops, and product sales.
5. "local-business" - A versatile layout for physical storefronts, services, communities, and anything else that doesn't fit the above.

RULES:
1. Base your classification on the primary purpose of the site.
2. If the user mentions selling or products, choose "ecommerce".
3. Return only valid JSON adhering to the schema.`;

  const prompt = `User request: "${description}"

Please classify this into the appropriate templateId.`;

  // Provide a fallback in case of errors
  try {
    return await provider.generateJSON(prompt, systemPrompt, intentSchema, { temperature: 0.1 });
  } catch (err) {
    console.error("Intent classification failed, falling back to local-business", err);
    return { templateId: "local-business", explanation: "Fallback due to parse error." };
  }
}
