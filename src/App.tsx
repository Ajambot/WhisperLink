import { useEffect, useState } from 'react'
import React from 'react';
import HomePage from 'C:/Users/devko/WhisperLink-1/src/components/HomePage.tsx';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, collection, query, onSnapshot, getFirestore} from 'firebase/firestore';
import Message from './components/Message';
import Chat from './components/Chat';
import { addMessageListener } from './handlers';
import type { message } from './types';

function App() {
  const [messages, setMessages] = useState<message[]>([]);
  useEffect(() => {
    const unsub = addMessageListener(setMessages);
    return () => unsub();
  }, [])

  return (
    <>
      <Chat>
        {messages.map((message)=>{
            return <Message senderName={message.senderName}>{message.text}</Message>
        })}
      </Chat>
    </>
  )

  return (
    <div className="App">
        <HomePage
            onJoin={() => console.log('Join button clicked')}
            onCreate={() => console.log('Create button clicked')}
        />
    </div>
);
}


export default App
