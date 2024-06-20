import "dotenv/config";
import { makeAnthropicChatLlm } from "./anthropic";
import { assertEnvVars, OpenAiChatMessage } from "mongodb-chatbot-server";
jest.setTimeout(30000);

// Note: you need to have ANTHROPIC_API_KEY in your environment variables
const { ANTHROPIC_API_KEY } = assertEnvVars({ ANTHROPIC_API_KEY: "" });

const messages = [
  { role: "user", content: "Tell me a JavaScript pun" },
] satisfies OpenAiChatMessage[];
describe("AnthropicChatLlm", () => {
  const anthropicChatLlm = makeAnthropicChatLlm({
    modelOptions: {
      anthropicApiKey: ANTHROPIC_API_KEY,
      model: "claude-3-sonnet-20240229",
      maxTokens: 250,
      temperature: 0.9,
    },
  });
  it("should answer awaited", async () => {
    const { role, content } = await anthropicChatLlm.answerQuestionAwaited({
      messages,
    });
    expect(role).toBe("assistant");
    expect(content).toBeTruthy();
  });
  it("should answer streaming", async () => {
    const res = await anthropicChatLlm.answerQuestionStream({
      messages,
    });
    let contentStream = "";
    for await (const event of res) {
      contentStream += event.choices[0].delta?.content;
    }
    expect(contentStream).toBeTruthy();
  });
});
