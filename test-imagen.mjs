import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    console.log("Testing generateImages...");
    const response = await client.models.generateImages({
      model: "imagen-3.0-generate-001",
      prompt: "A beautiful forest",
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1"
      }
    });
    console.log("Success SDK! Image data length:", response.generatedImages[0].image.imageBytes.length);
  } catch (err) {
    console.error("SDK Error:", err.message);
  }

  try {
    console.log("\\nTesting raw fetch to v1alpha...");
    const url = "https://generativelanguage.googleapis.com/v1alpha/models/imagen-3.0-generate-001:predict?key=" + process.env.GEMINI_API_KEY;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: "A beautiful forest" }],
        parameters: { sampleCount: 1 }
      })
    });
    const data = await res.json();
    if (data.predictions) console.log("Raw fetch v1alpha SUCCESS! Length:", data.predictions[0].bytesBase64Encoded.length);
    else console.error("Raw fetch v1alpha error:", data);
  } catch (e) {
    console.error("Fetch error:", e.message);
  }
}
run();
