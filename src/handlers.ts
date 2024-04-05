// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  collection,
  doc,
  onSnapshot,
  getFirestore,
  arrayUnion,
  updateDoc,
  setDoc,
  query,
  where,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import type { chat, user } from "./types";
import { SetStateAction } from "react";
import {
  connectStorageEmulator,
  getDownloadURL,
  getMetadata,
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
  user: user | undefined,
  setChats: React.Dispatch<SetStateAction<chat[]>>
) => {
  if (!user) user = { username: "", userId: "" };
  const q = query(
    collection(db, "Chats"),
    where("users", "array-contains", user)
  );
  const unsub = onSnapshot(q, (querySnapshot) => {
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

export const createNewChat = (
  chatName: string,
  chatId: string,
  user: user,
  QandA: { question: string; answer: string },
  callback: () => void
) => {
  void (async (chatId: string, user: user, QandA) => {
    const { question, answer } = QandA;
    await setDoc(doc(db, "Chats", chatId), {
      chatName: chatName,
      createdAt: new Date(),
      users: [user],
      messages: [],
      securityQuestion: question,
      securityAnswer: answer,
    });
    callback();
  })(chatId, user, QandA);
};

export const joinChat = (
  chatId: string,
  user: user,
  answer: string,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<user | undefined>>,
  setQuestion: React.Dispatch<React.SetStateAction<string | undefined>>,
  setPopups: React.Dispatch<
    React.SetStateAction<{
      link: boolean;
      create: boolean;
      join: boolean;
      newChat: boolean;
      currChat: boolean;
    }>
  >
) => {
  void (async (chatId: string, user: user, answer) => {
    const chatRef = doc(db, "Chats", chatId);
    const chat = await getDoc(chatRef);
    const chatData = chat.data();
    if (!chatData || answer !== chatData.securityAnswer) {
      setError(true);
      return;
    }
    setUser(user);
    setPopups({
      create: false,
      join: false,
      link: true,
      newChat: false,
      currChat: false,
    });
    setQuestion(undefined);
    setError(false);
    await updateDoc(chatRef, {
      users: arrayUnion(user),
    });
  })(chatId, user, answer);
};

export const fetchQuestion = (
  chatId: string,
  setQuestion: React.Dispatch<React.SetStateAction<string | undefined>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  void (async (chatId) => {
    const chatRef = doc(db, "Chats", chatId);
    const chat = await getDoc(chatRef);
    const chatData = chat.data();
    if (!chatData) {
      setError(true);
      return;
    }
    setQuestion(chatData.securityQuestion as string);
  })(chatId);
};

export const leaveChat = (chatId: string, user: user) => {
  void (async (chatId: string, user: user) => {
    await updateDoc(doc(db, "Chats", chatId), {
      users: arrayRemove(user),
    });
  })(chatId, user);
};

export const sendMessage = (
  chatId: string,
  sender: user,
  message: string,
  file: File | undefined
) => {
  void (async (
    chatId: string,
    sender: user,
    message: string,
    file: File | undefined
  ) => {
    let fileLink, type;
    if (file) {
      const extension = file.name.split(".").pop();
      const filename = uuidv4() + "." + extension;
      fileLink = await uploadBytes(ref(store, filename), file).then(
        (snapshot) =>
          getDownloadURL(snapshot.ref).then((downloadURL) => downloadURL)
      );
      type = await getMetadata(ref(store, filename)).then((metadata) => {
        const mime = metadata.contentType;
        if (mime && mime.startsWith("image/")) return "image";
        return "other";
      });
    }
    const newMessage = {
      sender: sender,
      text: message,
      ...(fileLink && { file: { link: fileLink, type: type } }),
      sessionId: "",
      sentAt: new Date(),
    };
    console.log(newMessage);
    await updateDoc(doc(db, "Chats", chatId), {
      messages: arrayUnion(newMessage),
    });
  })(chatId, sender, message, file);
};

export const downloadFile = async (link: string | undefined) => {
  void (async (link: string | undefined) => {
    if (!link) return;
    try {
      const response = await fetch(link);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = uuidv4();
      anchor.target = "_blank";
      document.body.appendChild(anchor);

      // Trigger the download
      anchor.click();

      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(anchor);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  })(link);
};
