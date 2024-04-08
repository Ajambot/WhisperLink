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
import type {
  chat,
  fbChat,
  fbUser,
  normalUser,
  optionalChat,
  user,
} from "./types";
import "crypto";
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
import { MdSportsGolf } from "react-icons/md";
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
  setChats: React.Dispatch<SetStateAction<chat[]>>,
  setUser: React.Dispatch<SetStateAction<user | undefined>>
) => {
    void(async () => {
      const storedUser = localStorage.getItem("user");
      if (!user && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser);
        for (const key in parsedUser.keys) {
          parsedUser.keys[key].keyPair.publicKey = await crypto.subtle.importKey(
            "jwk",
            JSON.parse(parsedUser.keys[key].keyPair.publicKey),
            {
              name: "RSA-OAEP",
              hash: "SHA-256",
            },
            true,
            ["encrypt"]
          );
          parsedUser.keys[key].keyPair.privateKey = await crypto.subtle.importKey(
            "jwk",
            JSON.parse(parsedUser.keys[key].keyPair.privateKey),
            {
              name: "RSA-OAEP",
              hash: "SHA-256",
            },
            true,
            ["decrypt"]
          );
          parsedUser.keys[key].groupKey = await crypto.subtle.importKey(
            "raw",
            stringToBuffer(parsedUser.keys[key].groupKey),
            { name: "AES-GCM" },
            true,
            ["encrypt", "decrypt"]
          );
        }
        setUser(parsedUser);
      }
  })();
  const q = query(collection(db, "Chats"));
  const unsub = onSnapshot(q, (querySnapshot) => {
    const chats: chat[] = [];
    querySnapshot.forEach((chat) => {
      const fbChat = chat.data() as fbChat;
      const curChat = { ...fbChat, sessionId: chat.id };
      chats.push(curChat);
    });
    const userChats = chats.filter((chat) => {
      for (const curUser of chat.users) {
        if (user?.userId === curUser.userId) {
          return true;
        }
      }
      return false;
    });
    void (async () => {
      for (const chat of chats) {
        let changed = false;
        for (const curUser of chat.users) {
          if (
            user?.role === "admin" &&
            user.keys[chat.sessionId] &&
            curUser.groupEncryptedKey === "pending"
          ) {
            changed = true;
            const groupKey = user.keys[chat.sessionId].groupKey as CryptoKey;
            const publicKey = await crypto.subtle.importKey(
              "jwk",
              JSON.parse(curUser.publicKey),
              {
                name: "RSA-OAEP",
                hash: "SHA-256",
              },
              true,
              ["encrypt"]
            );
            curUser.groupEncryptedKey = bufferToString(
              await encryptGroupKey(groupKey, publicKey)
            );
          } else if (
            user?.keys[chat.sessionId] &&
            user?.keys[chat.sessionId].groupKey === "pending" &&
            curUser.userId === user.userId
          ) {
            const encryptedGroupKey = curUser.groupEncryptedKey;
            const decryptedGroupKey = await decryptGroupKey(
              stringToBuffer(encryptedGroupKey),
              user.keys[chat.sessionId].keyPair.privateKey
            );
            setUser((prevUser) => {
              if (!prevUser) return prevUser;
              prevUser.keys[chat.sessionId].groupKey = decryptedGroupKey;
              return prevUser;
            });
          }
          if (changed) {
            const newChat = { ...chat } as optionalChat;
            delete newChat.sessionId;
            await setDoc(doc(db, "Chats", chat.sessionId), newChat);
          }
        }
      }
      for (const chat of userChats) {
        const messages = chat.messages;
        if (
          !user?.keys[chat.sessionId] ||
          user.keys[chat.sessionId].groupKey === "pending"
        )
          continue;
        const groupKey = user.keys[chat.sessionId].groupKey;
        const decryptedMessages = await Promise.all(
          messages.map(async (msg) => {
            msg.text = await decryptMessage(
              stringToBuffer(msg.text),
              groupKey as CryptoKey,
              msg.iv
            );
            return msg;
          })
        );
        chat.messages = decryptedMessages;
      }

      const stringKeys = { ...user?.keys } as Record<string, unknown>;
      for (const key in user?.keys) {
        const publicString = JSON.stringify(
          await crypto.subtle.exportKey("jwk", user.keys[key].keyPair.publicKey)
        );
        const privateString = JSON.stringify(
          await crypto.subtle.exportKey(
            "jwk",
            user.keys[key].keyPair.privateKey
          )
        );
        const groupString = bufferToString(
          await crypto.subtle.exportKey(
            "raw",
            user.keys[key].groupKey as CryptoKey
          )
        );
        stringKeys[key] = {
          keyPair: { publicKey: publicString, privateKey: privateString },
          groupKey: groupString,
        };
      }
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, keys: stringKeys })
      );

      setChats(userChats);
    })();
  });
  return () => unsub();
};

export const createNewChat = (
  chatName: string,
  setUser: React.Dispatch<React.SetStateAction<user | undefined>>,
  setPopups: React.Dispatch<
    React.SetStateAction<{
      link: boolean;
      create: boolean;
      newChat: boolean;
      join: boolean;
    }>
  >,
  QandA: { question: string; answer: string },
  username: string,
  user?: user
) => {
  void (async (chatName, setUser, setPopups, QandA, username, user?) => {
    const keypair = await generateKeyPair();
    const groupKey = await generateGroupKey();
    const groupEncryptedKey = await encryptGroupKey(
      groupKey,
      keypair.publicKey
    );
    const publicKey = await crypto.subtle.exportKey("jwk", keypair.publicKey);
    const firebaseUser = {
      username: username,
      userId: user?.userId || uuidv4(),
      publicKey: JSON.stringify(publicKey),
      groupEncryptedKey: bufferToString(groupEncryptedKey),
      role: "admin" as const,
    };
    const { question, answer } = QandA;
    const chatId = uuidv4();
    await setDoc(doc(db, "Chats", chatId), {
      chatName: chatName,
      createdAt: new Date(),
      users: [firebaseUser],
      messages: [],
      securityQuestion: question,
      securityAnswer: answer,
    });
    if (user) {
      setUser((prevUser) => {
        if (prevUser) {
          prevUser.keys[chatId] = {
            keyPair: keypair,
            groupKey,
          };
          return prevUser;
        }
      });
    } else {
      const User: user = {
        ...firebaseUser,
        keys: {},
      };
      User.keys[chatId] = {
        keyPair: keypair,
        groupKey,
      };
      setUser(User);
    }
    setPopups({
      join: false,
      link: true,
      create: false,
      newChat: false,
    });
  })(chatName, setUser, setPopups, QandA, username, user);
};

export const joinChat = (
  chatId: string,
  username: string,
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
    }>
  >,
  user?: user
) => {
  void (async (
    chatId,
    username,
    answer,
    setError,
    setUser,
    setQuestion,
    setPopups,
    user?
  ) => {
    const chatRef = doc(db, "Chats", chatId);
    const chat = await getDoc(chatRef);
    const chatData = chat.data();
    if (!chatData || answer !== chatData.securityAnswer) {
      setError(true);
      return;
    }
    const keyPair = await generateKeyPair();
    const publicKey = JSON.stringify(
      await crypto.subtle.exportKey("jwk", keyPair.publicKey)
    );
    const firebaseUser = {
      username,
      userId: user?.userId || uuidv4(),
      publicKey: publicKey,
      groupEncryptedKey: "pending" as const,
      role: "user" as const,
    };
    await updateDoc(chatRef, {
      users: arrayUnion(firebaseUser),
    });

    if (user) {
      setUser((prevUser) => {
        if (prevUser) {
          prevUser.keys[chatId] = {
            keyPair,
            groupKey: "pending",
          };
          return prevUser;
        }
      });
    } else {
      const User: user = {
        ...firebaseUser,
        keys: {},
      };

      User.keys[chatId] = {
        keyPair: keyPair,
        groupKey: "pending" as const,
      };
      setUser(User);
    }
    setPopups({
      create: false,
      join: false,
      link: true,
      newChat: false,
    });
    setQuestion(undefined);
    setError(false);
  })(
    chatId,
    username,
    answer,
    setError,
    setUser,
    setQuestion,
    setPopups,
    user || undefined
  );
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

export const leaveChat = (chatId: string, userId: string, users: fbUser[]) => {
  const newUsers = users.filter((curUser) => curUser.userId !== userId);
  void (async () => {
    await updateDoc(doc(db, "Chats", chatId), {
      users: newUsers,
    });
  })();
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
    const imageExtensions = [
      "apng",
      "avif",
      "gif",
      "jpg",
      "jpeg",
      "jfif",
      "pjpeg",
      "pjp",
      "png",
      "svg",
      "webp",
    ];
    const groupKey = sender.keys[chatId].groupKey;
    if (groupKey === "pending") return;
    let fileLink, type, ivtemp;
    if (file) {
      const extension = file.name.split(".").pop() as string;
      const filename = uuidv4() + "." + extension;
      const { encryptedFile, iv } = await encryptFile(file, groupKey);
      ivtemp = iv;
      fileLink = await uploadBytes(ref(store, filename), encryptedFile).then(
        (snapshot) =>
          getDownloadURL(snapshot.ref).then((downloadURL) => downloadURL)
      );
      type = imageExtensions.includes(extension?.toLowerCase())
        ? "image"
        : "other";
    }
    // await getMetadata(ref(store, filename)).then((metadata) => {
    //         const mime = metadata.contentType;
    //         if (mime && mime.startsWith("image/")) return "image";
    //         return "other";
    //       });

    const { encryptedMessage, iv } = await encryptMessage(message, groupKey);
    const newMessage = {
      sender: { username: sender.username, userId: sender.userId },
      text: bufferToString(encryptedMessage),
      iv: bufferToString(iv),
      ...(fileLink && {
        file: {
          link: fileLink,
          type: type,
          iv: bufferToString(ivtemp as Uint8Array),
        },
      }),
      sessionId: "",
      sentAt: new Date(),
    };
    await updateDoc(doc(db, "Chats", chatId), {
      messages: arrayUnion(newMessage),
    });
  })(chatId, sender, message, file);
};

export const downloadFile = async (
  link: string | undefined,
  groupKey: CryptoKey | "pending",
  iv: string | undefined,
  type: "image" | "other",
  id?: string
) => {
  void (async () => {
    if (!link || groupKey === "pending" || !iv) return;
    try {
      const response = await fetch(link);
      const encryptedBuffer = await response.arrayBuffer();
      const blob = await decryptFile(encryptedBuffer, groupKey, iv);
      const blobUrl = window.URL.createObjectURL(blob);

      if (type === "other") {
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
      } else if (id) {
        const img = document.getElementById(id) as HTMLImageElement;
        img.src = blobUrl;
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  })();
};

const encryptFile = async (file: File, groupKey: CryptoKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedFile = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    groupKey,
    await file.arrayBuffer()
  );
  return { encryptedFile, iv };
};

const encryptMessage = async (message: string, groupKey: CryptoKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedMessage = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    groupKey,
    new TextEncoder().encode(message)
  );
  return { encryptedMessage, iv };
};

const encryptGroupKey = async (groupKey: CryptoKey, publicKey: CryptoKey) => {
  const exportedGroupKey = await crypto.subtle.exportKey("raw", groupKey);
  const encryptedGroupKey = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    exportedGroupKey
  );

  return encryptedGroupKey;
};

const decryptFile = async (
  encryptedFile: ArrayBuffer,
  groupKey: CryptoKey,
  iv: string
) => {
  const decryptedFile = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: stringToBuffer(iv),
    },
    groupKey,
    encryptedFile
  );

  return new Blob([decryptedFile]);
};

const decryptMessage = async (
  encryptedMessage: Uint8Array,
  groupKey: CryptoKey,
  iv: string
) => {
  const decryptedMessage = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: stringToBuffer(iv),
    },
    groupKey,
    encryptedMessage
  );

  return new TextDecoder().decode(decryptedMessage);
};

const decryptGroupKey = async (
  encryptedGroupKey: ArrayBuffer,
  privateKey: CryptoKey
) => {
  const decryptedGroupKeyBuffer = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedGroupKey
  );
  const decryptedGroupKey = await crypto.subtle.importKey(
    "raw",
    decryptedGroupKeyBuffer,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return decryptedGroupKey;
};

export const generateKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return keyPair;
};

const generateGroupKey = async () => {
  const groupKey = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return groupKey;
};

export const bufferToString = (iv: ArrayBuffer) => {
  const ivHex = Array.from(new Uint8Array(iv))
    .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
    .join("");
  return ivHex;
};

export const stringToBuffer = (ivHex: string) => {
  const buffer = new Uint8Array(ivHex.length / 2);
  for (let i = 0; i < ivHex.length; i += 2) {
    buffer[i / 2] = parseInt(ivHex.substring(i, i + 2), 16);
  }
  return buffer;
};
