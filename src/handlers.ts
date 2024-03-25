// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  collection,
  doc,
  addDoc,
  onSnapshot,
  getFirestore,
  arrayUnion,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import type { chat, user } from "./types";
import { SetStateAction } from "react";
import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCQJ1BjqhJVMz8e3tjCRpVljF5NXP8Rw_0",
  authDomain: "whisperlink.firebaseapp.com",
  projectId: "whisperlink",
  storageBucket: "whisperlink.appspot.com",
  messagingSenderId: "1003772013353",
  appId: "1:1003772013353:web:ccb03dc280854d2f156538",
  measurementId: "G-ZXS5MQRL5W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const store = getStorage(app);
connectFirestoreEmulator(db, "127.0.0.1", 8080); // Remove in production
connectStorageEmulator(store, "127.0.0.1", 9199); // Remove in production

export const addChatsListener = (
  setChats: React.Dispatch<SetStateAction<chat[]>>
) => {
  const unsub = onSnapshot(collection(db, "Chats"), (querySnapshot) => {
    const chats: chat[] = [];
    querySnapshot.forEach((chat) => {
      chats.push(chat.data() as chat);
      chats[chats.length - 1].sessionId = chat.id;
    });
    chats.forEach((chat) =>
      chat.messages.sort((a, b) => (a.sentAt > b.sentAt ? 1 : -1))
    );
    setChats(chats);
  });

  return () => unsub();
};

export const createNewChat = (chatId: string, user: user) => {
  void (async (chatId: string, user: user) => {
    await setDoc(doc(db, "Chats", chatId), {
      createdAt: new Date(),
      users: [user],
      messages: [],
    });
  })(chatId, user);
};

export const sendMessage = (
  chatId: string,
  message: string,
  file: File | undefined
) => {
  void (async (chatId: string, message: string, file: File | undefined) => {
    let fileLink;
    if (file) {
      const extension = file.name.split(".").pop();
      const filename = uuidv4() + "." + extension;
      fileLink = await uploadBytes(ref(store, filename), file).then(
        (snapshot) =>
          getDownloadURL(snapshot.ref).then((downloadURL) => downloadURL)
      );
    }
    const newMessage = {
      senderName: "Martin",
      text: message,
      fileLink: fileLink || null,
      sessionId: "",
      sentAt: new Date(),
    };
    await updateDoc(doc(db, "Chats", chatId), {
      messages: arrayUnion(newMessage),
    });
  })(chatId, message, file);
};
