import connectToDatabase from "@/lib/mongodb";

const seedData = [
  {
    name: "Paul's Plumbing Co.",
    service: "Plumbing Services",
    region: "Sydney, NSW",
    phone: "(02) 9876 5432",
    email: "paul@paulsplumbing.com",
    abn: "12 345 678 901",
    description:
      "Professional plumbing services with 15+ years experience. We specialize in residential and commercial plumbing, emergency repairs, and bathroom renovations.",
    operatingHours: "Mon-Fri: 7AM-6PM, Sat: 8AM-4PM, Sun: Emergency only",
    serviceAreas: [
      "Sydney CBD",
      "North Shore",
      "Eastern Suburbs",
      "Inner West",
    ],
    credentials: [
      "Licensed Plumber (NSW)",
      "Public Liability Insurance",
      "Workers Compensation",
      "Master Plumbers Association Member",
    ],
    jobPreferences: {
      residential: 9,
      commercial: 7,
      emergency: 8,
      maintenance: 6,
    },
    rating: 4.8,
    reviews: 127,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Elite Electricians",
    service: "Electrical Repairs & Installation",
    region: "Melbourne, VIC",
    phone: "(03) 9234 5678",
    email: "contact@eliteelectrics.com.au",
    abn: "23 456 789 012",
    description:
      "Licensed electricians for residential and commercial work. Available for emergency callouts 24/7.",
    operatingHours: "Mon-Fri: 6AM-8PM, Sat-Sun: 8AM-6PM",
    serviceAreas: ["Melbourne CBD", "South Melbourne", "Richmond", "Prahran"],
    credentials: [
      "Licensed Electrician (VIC)",
      "Public Liability Insurance",
      "Electrical Safety Certificate",
    ],
    jobPreferences: {
      residential: 8,
      commercial: 9,
      emergency: 7,
      maintenance: 8,
    },
    rating: 4.9,
    reviews: 89,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Handy Harry's Handyman",
    service: "General Handyman",
    region: "Brisbane, QLD",
    phone: "(07) 3123 4567",
    email: "harry@handyharry.com.au",
    abn: "34 567 890 123",
    description:
      "Your go-to handyman for all home repairs and maintenance. No job too small!",
    operatingHours: "Mon-Sat: 7AM-5PM",
    serviceAreas: [
      "Brisbane City",
      "South Brisbane",
      "West End",
      "Fortitude Valley",
    ],
    credentials: [
      "Trade Qualified",
      "Public Liability Insurance",
      "Police Check",
    ],
    jobPreferences: {
      residential: 10,
      commercial: 5,
      emergency: 6,
      maintenance: 9,
    },
    rating: 4.7,
    reviews: 156,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "GreenThumb Landscaping",
    service: "Garden & Lawn Care",
    region: "Perth, WA",
    phone: "(08) 9456 7890",
    email: "info@greenthumbgardeners.com.au",
    abn: "45 678 901 234",
    description:
      "Transform your outdoor space with professional landscaping services. Specializing in native Australian gardens.",
    operatingHours: "Mon-Fri: 6AM-4PM, Sat: 7AM-3PM",
    serviceAreas: ["Perth CBD", "Subiaco", "Nedlands", "Cottesloe"],
    credentials: [
      "Horticulture Certificate",
      "Public Liability Insurance",
      "Pesticide License",
    ],
    jobPreferences: {
      residential: 9,
      commercial: 6,
      emergency: 3,
      maintenance: 8,
    },
    rating: 4.6,
    reviews: 203,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedDatabase() {
  try {
    const { db } = await connectToDatabase();

    // Check if data already exists
    const existingCount = await db.collection("listings").countDocuments();

    if (existingCount === 0) {
      const result = await db.collection("listings").insertMany(seedData);
      console.log(`✅ Inserted ${result.insertedCount} listings`);
    } else {
      console.log("ℹ️  Database already seeded");
    }

    // Create indexes
    await db.collection("listings").createIndex({ email: 1 }, { unique: true });
    await db.collection("listings").createIndex({ service: 1 });
    await db.collection("listings").createIndex({ region: 1 });
    await db.collection("listings").createIndex({ status: 1 });
    await db.collection("listings").createIndex({ ghlContactId: 1 });

    console.log("✅ Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
