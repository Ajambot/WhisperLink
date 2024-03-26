import { v4 as uuidv4 } from "uuid"
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.tsx";
import Message from "./components/Message";
import Chat from "./components/Chat";
import { addChatsListener, createNewChat, joinChat } from "./handlers";
import { chat, user } from "./types";
import Popup from "./components/Popup.tsx";
import styles from "./App.module.css"
import buttonStyles from "./buttonText.module.css"

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
    const unsub = addChatsListener(user, setChats);
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
    <>
      {chats.length ? (
        <>
          {chats.map((chat, index) => {
            return (
              <button className={buttonStyles.textContainer} type="button" onClick={() => setOpenChat(index)}>
                {chat.chatName}
              </button>
            );
          })}
          <Chat user={user} chatId={chats[openChat].sessionId}>
            {chats[openChat].messages.map((message) => {
              return (
                <Message senderName={message.sender.username}>
                  {message.text}
                </Message>
              );
            })}
          </Chat>
        </>
      ) : (
        <HomePage
          onJoin={() => {
            setPopups({...popups, join: true})
          }}
          onCreate={async () => {
            setPopups({...popups, create: true})
          }}
        ></HomePage>
      )}
      {popups.link ? (
        <Popup
          title="Your chat link"
          closeFn={() => setPopups({ ...popups, link: false })}
        >
          <input type="text" readOnly value={link} />
          <button className={buttonStyles.textContainer}
            type="button"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copy Join Link
          </button>
          <input type="text" readOnly value={chatId} />
          <button className={buttonStyles.textContainer}
            type="button"
            onClick={() => navigator.clipboard.writeText(chatId)}
          >
            Copy Chat ID
          </button>
          <button className={buttonStyles.textContainer} type="button"
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
              <button className={buttonStyles.textContainer} type="submit">Create</button>
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
              <button className={buttonStyles.textContainer} type="submit">Join</button>
            </form>
        </Popup>)
        :<></>
        }
    </>
  );
}

export default App;