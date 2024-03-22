import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.tsx";
import Message from "./components/Message";
import Chat from "./components/Chat";
import { addChatsListener, createNewChat } from "./handlers";
import { chat } from "./types";

function App() {
  const [chats, setChats] = useState<chat[]>([]);
  const [openChat, setOpenChat] = useState(0);

  useEffect(() => {
    const unsub = addChatsListener(setChats);
    return () => unsub();
  }, []);
  return (
    <>
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
        </>
      ) : (
        <HomePage
          onJoin={() => {
            createNewChat("123", { username: "Martin", userId: "1" });
          }}
          onCreate={() => {
            createNewChat("123", { username: "Martin", userId: "1" });
          }}
        ></HomePage>
      )}
    </>
  );
}

export default App;
