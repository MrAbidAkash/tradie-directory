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

  // Map GHL fields to your user model
  return {
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    email: contact.email || "",
    phone: contact.phone || "",
    address: contact.address || "",
    // Add other fields as needed
  };
}

export async function setGHLField(contactId: string, value: any) {
  const url = `https://rest.gohighlevel.com/v1/contacts/${contactId}`;

  const payload = {
    customField: {
      tCbXnBRMYkXGsP1u3OrJ: value, // Your custom field ID
    },
  };

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`GHL API Error: ${res.status}`);
  }

  return res.json();
}
