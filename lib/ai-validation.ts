import { getGHLContactDetails } from "@/lib/ghl";
import path from "path";
import { promises as fs } from "fs";
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function validateBusinessCredentials(
  listingData: any,
): Promise<{ valid: boolean; message: string }> {
  if (!OpenAI) {
    console.error("OpenAI not configured");
    return { valid: false, message: "AI validation service unavailable" };
  }

  try {
    // Prepare messages for AI validation
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are a business credential validation assistant. Verify the business credentials based on the provided information. Reply ONLY with 'valid' or 'invalid' followed by a colon and a brief reason.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Validate these business credentials for ${
              listingData.name
            } (ABN: ${listingData.abn}):
              
              Services: ${listingData.services?.join(", ")}
              Regions: ${listingData.regions?.join(", ")}
              
              Licenses: ${listingData.licenses?.join("\n") || "None"}
              Insurances: ${listingData.insurances?.join("\n") || "None"}
              Certifications: ${listingData.certifications?.join("\n") || "None"}
              
              Please check:
              1. Licenses match the services offered
              2. Insurances are appropriate for the business type
              3. Certifications are relevant
              4. All credentials appear genuine
              
              Reply format: "valid: reason" OR "invalid: reason"`,
          },
        ],
      },
    ];

    // Add uploaded documents as images
    for (const file of listingData.files) {
      const filePath = path?.join(process.cwd(), "public", file);
      const fileData = await fs.readFile(filePath);
      const base64Image = fileData.toString("base64");

      messages.push({
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: "high",
            },
          },
          {
            type: "text",
            text: "Validate this document: Does it appear to be a legitimate business credential? Check for official seals, expiration dates, and consistency with the business information.",
          },
        ],
      });
    }

    // Send to OpenAI
    const result = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 200,
      temperature: 0.1,
    });

    const response = result.choices[0].message.content || "";
    const [status, reason] = response
      .split(":")
      .map((part) => part.trim().toLowerCase());

    return {
      valid: status === "valid",
      message: reason || "AI validation failed to provide a reason",
    };
  } catch (error: any) {
    console.error("Business credential validation error:", error);
    if (error.status === 429) {
      return {
        valid: false,
        message: "AI validation quota exceeded. Please try again later.",
      };
    }
    return {
      valid: false,
      message: "Business credential validation service unavailable",
    };
  }
}
