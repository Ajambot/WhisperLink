import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.tsx";
import Message from "./components/Message";
import Chat from "./components/Chat";
import { addMessageListener } from "./handlers";
import type { message } from "./types";

function App() {
  const [messages, setMessages] = useState<message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chatbox visibility

  useEffect(() => {
    const unsub = addMessageListener(setMessages);
    return () => unsub();
  }, []);
  return (
    <>
      {isChatOpen ? (
        <Chat>
          {messages.map((message) => {
            return (
              <Message senderName={message.senderName}>{message.text}</Message>
            );
          })}
        </Chat>
      ) : (
        <HomePage
          onJoin={() => {
            setIsChatOpen(true);
            console.log("Join button clicked");
          }}
          onCreate={() => {
            setIsChatOpen(true);
            console.log("Create button clicked");
          }}
        ></HomePage>
      )}
    </>
  );
}

export default App;
