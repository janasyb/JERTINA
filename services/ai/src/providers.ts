export type AIProviderName = "openai" | "anthropic" | "local" | "custom";

export interface AIProviderMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export interface AIProviderRequest {
  model: string;
  messages: AIProviderMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIProviderResponse {
  provider: AIProviderName;
  model: string;
  content: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface AIProvider {
  name: AIProviderName;
  generate(request: AIProviderRequest): Promise<AIProviderResponse>;
}

export class InMemoryAIProvider implements AIProvider {
  name: AIProviderName = "local";

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const lastUserMessage = [...request.messages].reverse().find((message) => message.role === "user");
    return {
      provider: this.name,
      model: request.model,
      content: lastUserMessage?.content ?? "AI response placeholder",
      usage: {
        inputTokens: request.messages.length * 10,
        outputTokens: 25,
      },
    };
  }
}
