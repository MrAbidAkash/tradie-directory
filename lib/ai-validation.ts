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
  if (!openai.apiKey) {
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
            } (ABN: ${listingData.abn || "Not Provided"}):
              
              Services: ${listingData.services?.join(", ") || "None"}
              Regions: ${listingData.regions?.join(", ") || "None"}
              
              Licenses: ${listingData.licenses?.join("\n") || "None"}
              Insurances: ${listingData.insurances?.join("\n") || "None"}
              Certifications: ${
                listingData.certifications?.join("\n") || "None"
              }
              
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

    // Log business credentials being validated
    console.log("\n\n===== VALIDATING BUSINESS CREDENTIALS =====");
    console.log("Business Name:", listingData.name);
    console.log("ABN:", listingData.abn || "Not provided");
    console.log("Services:", listingData.services?.join(", ") || "None");
    console.log("Regions:", listingData.regions?.join(", ") || "None");
    console.log("Licenses:", listingData.licenses?.join("\n") || "None");
    console.log("Insurances:", listingData.insurances?.join("\n") || "None");
    console.log(
      "Certifications:",
      listingData.certifications?.join("\n") || "None",
    );
    console.log("Files Count:", listingData.files?.length || 0);

    // SAFELY HANDLE FILES
    const files: any[] = listingData.files || [];
    if (Array.isArray(files)) {
      console.log("\n===== PROCESSING UPLOADED FILES =====");
      for (const [index, file] of files.entries()) {
        try {
          // Extract actual file path
          let filePath = "";

          if (typeof file === "string") {
            filePath = file;
          } else if (file?.path && typeof file.path === "string") {
            filePath = file.path;
          } else if (file?.url && typeof file.url === "string") {
            filePath = file.url;
          } else {
            console.warn(
              `[FILE ${index + 1}] Skipping invalid file object:`,
              file,
            );
            continue;
          }

          // Log file processing
          console.log(`\n[FILE ${index + 1}] Processing:`, filePath);
          console.log(`- Cleaned path: ${filePath}`);

          const fullPath = path.join(process.cwd(), "public", filePath);
          console.log(`- Full system path: ${fullPath}`);

          const fileData = await fs.readFile(fullPath);
          const base64Image = fileData.toString("base64");

          // Log image data preview
          console.log(
            `- Image data: data:image/jpeg;base64,${base64Image.substring(
              0,
              50,
            )}... [${base64Image.length} chars total]`,
          );
          console.log(`- File size: ${Math.round(fileData.length / 1024)}KB`);
          console.log(`- Document being validated for: ${listingData.name}`);

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
        } catch (fileError) {
          console.error(
            `[FILE ${index + 1}] Error processing file:`,
            file,
            fileError,
          );
        }
      }
    }

    // Send to OpenAI
    console.log("\n===== SENDING TO AI VALIDATION =====");
    const result = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 200,
      temperature: 0.1,
    });

    const response = result.choices[0].message.content || "";
    console.log("AI Raw Response:", response);

    const [status, reason] = response
      .split(":")
      .map((part) => part.trim().toLowerCase());

    const valid = status === "valid";

    console.log("\n===== VALIDATION RESULT =====");
    console.log("Status:", valid ? "VALID" : "INVALID");
    console.log("Reason:", reason || "No reason provided");
    console.log("Full AI Response:", JSON.stringify(result, null, 2));

    return {
      valid,
      message: reason || "AI validation failed to provide a reason",
    };
  } catch (error: any) {
    console.error("\n===== VALIDATION ERROR =====");
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
