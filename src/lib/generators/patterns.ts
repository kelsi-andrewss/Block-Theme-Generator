export async function generatePatterns(
  enrichedPrompt: any,
  themeJson: Record<string, unknown>,
  provider: any
): Promise<Map<string, string>> {
  // Pattern generation has been deprecated in favor of the "Skinning Approach",
  // which relies entirely on robust, hardcoded blocks in templates.ts.
  return new Map<string, string>();
}
