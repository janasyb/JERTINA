import { prisma } from "../src/client.mjs";

const categories = [
  {
    name: "Cleaning Tools",
    slug: "cleaning-tools",
    description: "Practical tools that make everyday cleaning easier.",
  },
  {
    name: "Kitchen Gadgets",
    slug: "kitchen-gadgets",
    description: "Useful gadgets for everyday kitchen tasks.",
  },
  {
    name: "Home Organization",
    slug: "home-organization",
    description: "Products that help make living spaces more organized.",
  },
  {
    name: "Storage Solutions",
    slug: "storage-solutions",
    description: "Flexible storage for everyday household needs.",
  },
  {
    name: "Laundry Products",
    slug: "laundry-products",
    description: "Practical products for laundry and clothing care.",
  },
  {
    name: "Travel Organizers",
    slug: "travel-organizers",
    description: "Organizers designed to simplify packing and travel.",
  },
  {
    name: "Car Accessories",
    slug: "car-accessories",
    description: "Useful accessories for a tidier, more convenient car.",
  },
  {
    name: "Office Organization",
    slug: "office-organization",
    description: "Products that help keep desks and workspaces organized.",
  },
];

try {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {
        name: category.name,
        description: category.description,
      },
    });
  }

  console.log(`Seeded ${categories.length} JERTINA categories. No products were fabricated.`);
} finally {
  await prisma.$disconnect();
}
