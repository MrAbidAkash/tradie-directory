export async function getGHLContactDetails(contactId: string) {
  const url = `https://rest.gohighlevel.com/v1/contacts/${contactId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`GHL API Error: ${res.status}`);
  }

  const contact = await res.json();

  console.log("getGHLContactDetails:", contact);

  // Map GHL fields to your user model
  return contact;
}

export async function setGHLField(contactId: string, value: any) {
  const url = `https://rest.gohighlevel.com/v1/contacts/${contactId}`;

  console.log("url FormComplete:", url);

  const payload = {
    customField: {
      tCbXnBRMYkXGsP1u3OrJ: value, // Your custom field ID
      IZtchawthhvBVr0zRo3M: "ApprovedByAI",
    },
  };
  console.log("payload  FormComplete:", payload);

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
  console.log("GHL Form Responseomplete:", responseData);

  if (!res.ok) {
    throw new Error(`GHL API Error: ${res.status}`);
  }

  return responseData;
}
