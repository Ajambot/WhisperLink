import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.tsx";
import Message from "./components/Message";
import Chat from "./components/Chat";
import {
  addChatsListener,
  createNewChat,
  joinChat,
  leaveChat,
} from "./handlers";
import { chat, user } from "./types";
import Popup from "./components/Popup.tsx";
import buttonStyles from "./buttonText.module.css"
import mainStyles from "./mainButtonText.module.css"

function App() {
  const [chats, setChats] = useState<chat[]>([]);
  const [openChat, setOpenChat] = useState(0);
  const [user, setUser] = useState<user>();
  const [popups, setPopups] = useState({
    link: false,
    create: false,
    join: false,
    newChat: false,
  });
  const [code, setCode] = useState("");

  const openJoinPopup = () => {
    setPopups({
      create: false,
      link: false,
      join: true,
      newChat: false,
    });
  };

  const openCreatePopup = () => {
    setPopups({
      create: true,
      link: false,
      join: false,
      newChat: false,
    });
  };
  useEffect(() => {
    const unsub = addChatsListener(user, setChats);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get("chatId");
    if (chatId) {
      setPopups({ create: false, link: false, join: true, newChat: false });
      setCode(chatId);
    }
  }, []);

  const link = chats.length
    ? "http://localhost:5000?chatId=" + chats[openChat].sessionId
    : "";
  const chatId = chats.length ? chats[openChat].sessionId : "";

  const closeChat = () => {
    if (user) {
      leaveChat(chats[openChat].sessionId, user);
      if(openChat==chats.length-1 && openChat>0) setOpenChat(openChat-1)
      setPopups({ link: false, create: false, join: false, newChat: false });
    }
  };

  return (
    <>
      {chats.length ? (
        <>
          <div className="chat-navbar">
            {chats.map((chat, index) => {
              return (
                <button className={buttonStyles.textContainer} type="button" onClick={() => setOpenChat(index)}>
                  {chat.chatName}
                </button>
              );
            })}
            <button className={buttonStyles.textContainer}
              onClick={() =>
                setPopups({
                  create: false,
                  join: false,
                  link: false,
                  newChat: true,
                })
              }
              type="button"
            >
              Add chat
            </button>
            {popups.newChat ? (
              <Popup
                title="New Chat"
                closeFn={() =>
                  setPopups({
                    create: false,
                    join: false,
                    link: false,
                    newChat: false,
                  })
                }
              >
                <div className="buttons">
                  <button className={mainStyles.textContainer}
                    onClick={() => {
                      setPopups({
                        create: false,
                        link: false,
                        join: true,
                        newChat: false,
                      });
                    }}
                  >
                    Join Chatroom
                  </button>
                  <button className={mainStyles.textContainer}
                    onClick={() => {
                      setPopups({
                        create: true,
                        link: false,
                        join: false,
                        newChat: false,
                      });
                    }}
                  >
                    Create Chatroom
                  </button>
                </div>
              </Popup>
            ) : (
              <></>
            )}
          </div>
          <Chat
            leaveChat={closeChat}
            user={user}
            chatId={chats[openChat].sessionId}
          >
            {chats[openChat].messages.map((message) => {
              return (
                <Message isSender = {message.sender.userId === user?.userId } senderName={message.sender.username}>
                  {message.text}
                </Message>
              );
            })}
          </Chat>
        </>
      ) : (
        <HomePage
          onJoin={() => {
            setPopups({
              create: false,
              link: false,
              join: true,
              newChat: false,
            });
          }}
          onCreate={async () => {
            setPopups({
              link: false,
              join: false,
              create: true,
              newChat: false,
            });
          }}
        ></HomePage>
      )}
      {popups.link ? (
        <Popup
          title="Your chat link"
          closeFn={() =>
            setPopups({
              create: false,
              join: false,
              link: false,
              newChat: false,
            })
          }
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
        </Popup>
      ) : (
        <></>
      )}
      {popups.create ? (
        <Popup
          title="Create a new chat"
          closeFn={() =>
            setPopups({
              join: false,
              link: false,
              create: false,
              newChat: false,
            })
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const chatName = form.get("chatName") as string;
              const displayName = form.get("displayName") as string;
              const newUser = {
                username: displayName,
                userId: user?.userId || uuidv4(),
              };
              createNewChat(chatName, uuidv4(), newUser);
              setUser(newUser);
              setPopups({
                join: false,
                link: true,
                create: false,
                newChat: false,
              });
            }}
          >
            <label htmlFor="chatName" style={{ padding: '12px' , fontSize: '22px'}}>Chat Name</label>
            <input type="text" style={{ padding: '12px' , marginRight: '50px'}} name="chatName"/>
            <label htmlFor="displayName" style={{ padding: '12px' , fontSize: '22px'}}>Display Name</label>
            <input style={{ padding: '12px' }}
              type="text"
              defaultValue={user?.username || ""}
              name="displayName"
            />
            <button type="submit" style={{ padding: '9px', fontSize: '18px' }}>Create</button>
          </form>
        </Popup>
      ) : (
        <></>
      )}
      {popups.join ? (
        <Popup
          title="Join a chat"
          closeFn={() =>
            setPopups({
              link: false,
              create: false,
              join: false,
              newChat: false,
            })
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const chatId = form.get("chatId") as string;
              const displayName = form.get("displayName") as string;
              const newUser = {
                username: displayName,
                userId: user?.userId || uuidv4(),
              };
              joinChat(chatId, newUser);
              setUser(newUser);
              setPopups({
                create: false,
                join: false,
                link: true,
                newChat: false,
              });
            }}
          >
            <label htmlFor="chatId" style={{ padding: '12px', fontSize: '22px' }}>Chat ID</label>
            <input type="text" defaultValue={code || "" } style={{ padding: '12px', marginRight: '50px'  }} name="chatId" />
            <label htmlFor="displayName" style={{ padding: '12px' , fontSize: '22px'}}>Display Name</label>
            <input style={{ padding: '12px' }}
              type="text"
              defaultValue={user?.username || ""}
              name="displayName"
            />
            <button type="submit" style={{ padding: '9px', fontSize: '18px' }}>Join</button>
          </form>
        </Popup>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;