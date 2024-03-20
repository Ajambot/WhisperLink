import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.tsx";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  collection,
  query,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
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

  const toggleChat = () => setIsChatOpen(!isChatOpen); // Toggle chatbox state

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
