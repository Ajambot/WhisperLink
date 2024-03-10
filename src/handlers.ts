// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, collection, doc, addDoc, onSnapshot, getFirestore} from 'firebase/firestore';
import type { message } from "./types";
import { SetStateAction } from "react";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080); // Remove in production

export const addMessageListener = (setMessages: React.Dispatch<SetStateAction<message[]>>) => {
    const unsub = onSnapshot(collection(db, "Messages"), (querySnapshot) => {
      const messages:message[] = []
      querySnapshot.forEach((msg) => {
        messages.push(msg.data() as message);
      });
      setMessages(messages);
    })

    return () => unsub();
}

export const sendMessage = (message: string) => { void(async (message: string) => {
  await addDoc(collection(db, "Messages"), {
    senderName: "Martin",
    text: message,
    imageLink: "",
    sessionId: ""
  })
})(message)};