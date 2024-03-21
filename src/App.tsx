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
  const [openChats, setOpenChats] = useState<number[]>([]);

  useEffect(() => {
    const unsub = addMessageListener(setMessages);
    return () => unsub();
  }, []);

  const toggleChat = (chatId: number) => {
    if (openChats.includes(chatId)) {
      setOpenChats(openChats.filter((id) => id !== chatId));
    } else {
      setOpenChats([...openChats, chatId]);
    }
  };

  return (
    <>
      {openChats.length > 0 ? (
        openChats.map((chatId) => (
          <Chat
            key={chatId}
            chatId={0}
            onClose={toggleChat}
          >
            {messages.map((message) => {
              return (
                <Message key={message.sentAt} senderName={message.senderName} chatId={chatId}>
                  {message.text}
                </Message>
              );
            })}
          </Chat>
        ))
      ) : (
        <HomePage
          onJoin={(chatId: number) => {
            toggleChat(chatId);
            console.log("Join button clicked");
          }}
          onCreate={(chatId: number) => {
            setOpenChats([...openChats, chatId]);
            console.log("Create button clicked");
          }}
        />
      )}
    </>
  );
}

export default App;
