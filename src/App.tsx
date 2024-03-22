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
import { addChatsListener, createNewChat, addMessageListener } from "./handlers";
import type { message, chat } from "./types";
import ChatIdGen from "./components/ChatIdGenerator.ts";

function App() {
  const [chats, setChats] = useState<chat[]>([]);
  const [openChats, setOpenChats] = useState<number[]>([]);
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    
    const unsub = addChatsListener(setChats);
    return () => unsub();
  }, [openChats]);

  const toggleChat = (chatId: number)  => {
    setOpenChats(currentChats => 
      currentChats.includes(chatId) ? 
      currentChats.filter(id => id !== chatId) : 
      [...currentChats, chatId]
    );
  };

  return (
    <>
      {openChats.length > 0 ? (
        openChats.map((chatId) => (
          <Chat
            key={chatId}
            chatId={chatId}
            onClose={() => toggleChat(chatId)}
          >
            {messages.filter(msg => msg.chatId === chatId).map((message) => (
              <Message key={message.sentAt.toString()} senderName={message.senderName} chatId={chatId}>
                {message.text}
              </Message>
            ))}
          </Chat>
        ))
      ) : (
        <HomePage
          onJoin={() => {
            toggleChat(chatId);
            console.log("Join button clicked");
            createNewChat(ChatIdGen, { username: "Martin", userId: "1" });
          }}
          onCreate={() => {
            setOpenChats([...openChats, chatId]);
            console.log("Create button clicked");
            createNewChat(ChatIdGen, { username: "Martin", userId: "1" });
          }}
        ></HomePage>
      )}
    </>
  );
}

export default App;