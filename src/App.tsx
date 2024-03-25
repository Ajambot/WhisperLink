import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.tsx";
import Message from "./components/Message";
import Chat from "./components/Chat";
import { addChatsListener, createNewChat } from "./handlers";
import { chat } from "./types";
import styles from "./App.module.css"

function App() {
  const [chats, setChats] = useState<chat[]>([]);
  const [openChat, setOpenChat] = useState(0);
  const [user, setUser] = useState<user>()
  const [popups, setPopups] = useState({
    link: false,
    create: false,
    join: false,
  });
  const [code, setCode] = useState("")

  useEffect(() => {
    const unsub = addChatsListener(setChats);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chatId')
    if (chatId) {
      setPopups({create: false, link: false, join: true})
      setCode(chatId)
    }
  },[])

  const link = chats.length
    ? "http://localhost:5000?chatId=" + chats[openChat].sessionId
    : "";
  const chatId = chats.length? chats[openChat].sessionId : "";


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
            Copy Join Link
          </button>
          <input type="text" readOnly value={chatId} />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(chatId)}
          >
            Copy Chat ID
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
      {popups.create ? (
        <Popup
          title="Create a new chat"
          closeFn={() => setPopups({ ...popups, create: false })}
          >
            <form onSubmit={(e)=>{
              e.preventDefault()
              const form = new FormData(e.currentTarget);
              const chatName = form.get("chatName") as string
              const displayName = form.get("displayName") as string
              const newUser = {username: displayName, userId: uuidv4()}
              createNewChat(chatName, uuidv4(), newUser);
              setUser(newUser)
              setPopups({...popups, link: true, create: false})
            }}>
              <label htmlFor="chatName">Chat Name</label>
              <input type="text" name="chatName"/>
              <label htmlFor="displayName">Display Name</label>
              <input type="text" name="displayName"/>
              <button type="submit">Create</button>
            </form>
        </Popup>)
        :<></>
        }
      {popups.join ? (
        <Popup
          title="Join a chat"
          closeFn={() => setPopups({ ...popups, join: false})}
          >
            <form onSubmit={(e)=>{
              e.preventDefault()
              const form = new FormData(e.currentTarget);
              const chatId = form.get("chatId") as string
              const displayName = form.get("displayName") as string
              const newUser = {username: displayName, userId: uuidv4()}
              joinChat(chatId, newUser);
              setUser(newUser)
              setPopups({...popups, join: false, link: true})
            }}>
              <label htmlFor="chatId">Chat ID</label>
              <input type="text" value={code || ""} name="chatId"/>
              <label htmlFor="displayName">Display Name</label>
              <input type="text" name="displayName"/>
              <button type="submit">Join</button>
            </form>
        </Popup>)
        :<></>
        }
    </>
  );
}

export default App;
