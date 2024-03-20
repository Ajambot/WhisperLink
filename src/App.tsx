import { useEffect, useState } from 'react'
import React from 'react';
import HomePage from 'C:/Users/devko/WhisperLink-1/src/components/HomePage.tsx';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, collection, query, onSnapshot, getFirestore} from 'firebase/firestore';
import Message from './components/Message';
// todo: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCQJ1BjqhJVMz8e3tjCRpVljF5NXP8Rw_0",
  authDomain: "whisperlink.firebaseapp.com",
  projectId: "whisperlink",
  storageBucket: "whisperlink.appspot.com",
  messagingSenderId: "1003772013353",
  appId: "1:1003772013353:web:ccb03dc280854d2f156538",
  measurementId: "G-ZXS5MQRL5W"
};

interface message{
  imageLink: string;
  senderName: string;
  sessionId: string;
  text: string;
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080); // Remove in production

function App() {
  const [messages, setMessages] = useState<message[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Messages"), (querySnapshot) => {
      console.log('Used function 1 time');
      const messages:message[] = []
      querySnapshot.forEach((msg) => {
        messages.push(msg.data() as message);
      });
      setMessages(messages);
    })

    return () => unsub();
  }, [])

  return (
    <>
      {messages.map((message) => {
        return <Message senderName={message.senderName} text={message.text}></Message>
      })}
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
