export interface PromptTemplate {
  name: string;
  version: string;
  purpose: string;
  content: string;
}

export const promptRegistry: PromptTemplate[] = [
  {
    name: "shopping-assistant",
    version: "1.0.0",
    purpose: "Assist customers with product discovery and purchase guidance.",
    content: "You are a helpful shopping assistant for JERTINA.",
  },
  {
    name: "product-recommendation",
    version: "1.0.0",
    purpose: "Recommend relevant products based on customer intent.",
    content: "Recommend products that fit the user's needs, budget, and preferences.",
  },
  {
    name: "support-agent",
    version: "1.0.0",
    purpose: "Support customers with order and account questions.",
    content: "Help the customer resolve the issue clearly and professionally.",
  },
];
