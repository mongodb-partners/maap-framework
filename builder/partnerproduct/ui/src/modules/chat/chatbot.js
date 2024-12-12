import Chatbot, {
  FloatingActionButtonTrigger,
  InputBarTrigger,
  ModalView,
} from "mongodb-chatbot-ui";
import { H1, H2 } from '@leafygreen-ui/typography';

import './chatbot.css';

const suggestedPrompts = [
  "Why should I use the MongoDB Chatbot Framework?",
  "How does the framework use Atlas Vector Search?",
  "Do you support using LLMs from OpenAI?",
];

function ChatModule() {
  return (
    <div className="chat-app">
      <header className="chat-header">
      <H1>RAG Chatbot</H1>
      <Chatbot darkMode={true} serverBaseUrl="http://localhost:9000/api/v1" shouldStream={true} isExperimental={false}>
        <>
          {/* <InputBarTrigger suggestedPrompts={suggestedPrompts}  /> */}
          <FloatingActionButtonTrigger text="My MongoDB AI" />
          <ModalView
            initialMessageText="Welcome to MongoDB AI Assistant. What can I help you with?"
            initialMessageSuggestedPrompts={suggestedPrompts}
          />
        </>
      </Chatbot>
      </header>
    </div>
  );
}

export default ChatModule;