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
import { addChatsListener, createNewChat } from "./handlers";
import { chat } from "./types";
import styles from "./App.module.css"


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
    <div>
      {chats.length ? (
        <>
          {chats.map((chat, index) => {
            return (
              <button type="button" onClick={() => setOpenChat(index)}>
                {chat.sessionId}
              </button>
            );
          })}
          <Chat chatId={chats[openChat].sessionId}>
            {chats[openChat].messages.map((message) => {
              return (
                <Message senderName={message.senderName}>
                  {message.text}
                </Message>
              );
            })}

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

            createNewChat("123", { username: "Martin", userId: "1" });
          }}          
        ></HomePage>
      )}
    </div>
  );
}

export default App;