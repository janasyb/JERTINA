import { AIProvider, AIProviderRequest, AIProviderResponse, InMemoryAIProvider } from "./providers";
import { promptRegistry } from "./prompts";

export interface AIOrchestratorOptions {
  provider?: AIProvider;
}

export interface AIExecutionInput {
  promptName: string;
  model: string;
  userMessage: string;
}

export class AIOrchestrator {
  private readonly provider: AIProvider;

  constructor(options: AIOrchestratorOptions = {}) {
    this.provider = options.provider ?? new InMemoryAIProvider();
  }

  async execute(input: AIExecutionInput): Promise<AIProviderResponse> {
    const prompt = promptRegistry.find((entry) => entry.name === input.promptName);

    const request: AIProviderRequest = {
      model: input.model,
      messages: [
        { role: "system", content: prompt?.content ?? "You are a JERTINA AI assistant." },
        { role: "user", content: input.userMessage },
      ],
    };

    return this.provider.generate(request);
  }
}
