import { AIOrchestrator } from "./orchestrator";

async function run() {
  const orchestrator = new AIOrchestrator();
  const result = await orchestrator.execute({
    promptName: "shopping-assistant",
    model: "local-test-model",
    userMessage: "Recommend a premium laptop bag for frequent travel.",
  });

  if (!result.content) {
    throw new Error("AI response content missing");
  }

  console.log("AI orchestrator test passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
