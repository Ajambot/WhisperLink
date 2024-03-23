import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.tsx";
import Message from "./components/Message";
import Chat from "./components/Chat";
import { addChatsListener, createNewChat } from "./handlers";
import { chat } from "./types";
import Popup from "./components/Popup.tsx";

function App() {
  const [chats, setChats] = useState<chat[]>([]);
  const [openChat, setOpenChat] = useState(0);
  const [popups, setPopups] = useState({
    link: false,
    create: false,
    join: false,
  });

  useEffect(() => {
    const unsub = addChatsListener(setChats);
    return () => unsub();
  }, []);
  const link = chats.length
    ? "http://localhost:5000?chatId=" + chats[openChat].sessionId
    : "";

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
            setPopups({ ...popups, link: true });
          }}
          onCreate={async () => {
            await createNewChat("123", { username: "Martin", userId: "1" });
            setPopups({ ...popups, link: true });
          }}
        ></HomePage>
      )}
      {popups.link ? (
        <Popup
          title="Your chat link"
          closeFn={() => setPopups({ ...popups, link: false })}
        >
          <input type="text" readOnly value={link} />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copy
          </button>
          <button
            type="button"
            onClick={() => setPopups({ ...popups, link: false })}
          >
            Close
          </button>
        </Popup>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
