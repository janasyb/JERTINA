import { AIOrchestrator } from "./orchestrator";

async function run() {
  const orchestrator = new AIOrchestrator();
  const result = await orchestrator.execute({
    promptName: "shopping-assistant",
    model: "local-test-model",
    userMessage: "Recommend a premium laptop bag for frequent travel.",
  });

  console.log(result.provider, result.model, result.content);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
