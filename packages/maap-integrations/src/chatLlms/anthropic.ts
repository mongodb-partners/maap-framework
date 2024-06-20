import {
  ChatLlm,
  makeLangchainChatLlm,
  MakeLangchainChatLlmProps,
} from "mongodb-chatbot-server";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseLanguageModelCallOptions } from "@langchain/core/language_models/base";

export interface MakeAnthropicChatLlmParams {
  modelOptions: ConstructorParameters<typeof ChatAnthropic>[0];
  callOptions?: BaseLanguageModelCallOptions;
}

export function makeAnthropicChatLlm({
  modelOptions,
  callOptions,
}: MakeAnthropicChatLlmParams) {
  // note: have to do this casting as unknown because the `makeLangchainChatLlm` function
  // uses an older version of the `BaseChatModel` interface
  // creating ticket for us to address this in newer version of `mongodb-chatbot-server`
  // https://jira.mongodb.org/browse/EAI-419
  const chatModel = new ChatAnthropic(
    modelOptions,
  ) as unknown as MakeLangchainChatLlmProps["chatModel"];
  const typedCallOptions =
    callOptions as unknown as MakeLangchainChatLlmProps["callOptions"];
  return makeLangchainChatLlm({
    chatModel,
    callOptions: typedCallOptions,
  });
}
