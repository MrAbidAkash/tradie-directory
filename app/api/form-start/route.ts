// app/api/form-start/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Form Start API called");
    const { contactId } = await req.json();

    if (!contactId) {
      throw new Error("Missing contactId parameter");
    }

    // Use correct field name (camelCase)
    const data = await setGHLField(contactId, "FormStarted");

    return NextResponse.json({
      success: true,
      message: "Form started",
      data: data,
    });
  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

async function setGHLField(contactId: string, value: any) {
  console.log("Setting GHL Field:", contactId, value);

  const url = `https://rest.gohighlevel.com/v1/contacts/${contactId}`;

  // For checkbox fields, value must be an array of selected option names

  const payload = {
    customField: {
      nc03HsphXNDwpjUH1uS0: value,
      DIjNhvh7ursbg27zN6rx: "ClickedPreviewLink",
    },
  };

  console.log("Payload:", JSON.stringify(payload, null, 2));

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await res.json();
  console.log("GHL Response:", responseData);

  if (!res.ok) {
    throw new Error(`GHL API Error: ${res.status}`);
  }

  return responseData;
}
