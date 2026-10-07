import { AIOrchestrator } from "./orchestrator.js";

const orchestrator = new AIOrchestrator();

const result = await orchestrator.execute({
  promptName: "shopping-assistant",
  model: "local-test-model",
  userMessage: "Summarize the AI platform runtime.",
});

console.log(JSON.stringify(result, null, 2));
