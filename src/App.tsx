import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage.tsx";
import Message from "./components/Message";
import Chat from "./components/Chat";
import {
  addChatsListener,
  createNewChat,
  downloadFile,
  fetchQuestion,
  joinChat,
  leaveChat,
} from "./handlers";
import { chat, user } from "./types";
import Popup from "./components/Popup.tsx";
import buttonStyles from "./buttonText.module.css"
import mainStyles from "./mainButtonText.module.css"
import main from "./App.module.css"
import "./Global.module.css";

function App() {
  const [chats, setChats] = useState<chat[]>([]);
  const [openChat, setOpenChat] = useState(0);
  const [user, setUser] = useState<user>();
  const [question, setQuestion] = useState<string>();
  const [popups, setPopups] = useState({
    link: false,
    create: false,
    join: false,
    newChat: false,
  });
  const [code, setCode] = useState("");
  const [valError, setValError] = useState(false);

  useEffect(() => {
    if(!user && !localStorage.getItem("user")) return;
    const unsub = addChatsListener(user, setChats, setUser);
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

  const createHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const chatName = form.get("chatName") as string;
    const displayName = form.get("displayName") as string;
    const question = form.get("securityQuestion") as string;
    const answer = form.get("securityAnswer") as string;
    createNewChat(chatName, setUser, setPopups, {question, answer}, displayName, user || undefined);
  }

  const fetchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValError(false);
    const form = new FormData(e.currentTarget);
    const chatId = form.get("chatId") as string;
    fetchQuestion(chatId, setQuestion, setValError);
  }
  const joinHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const chatId = form.get("chatId") as string;
    const displayName = form.get("displayName") as string;
    const securityAnswer = form.get("securityAnswer") as string;
    joinChat(chatId, displayName, securityAnswer, setValError, setUser, setQuestion, setPopups, user || undefined)
  }

  const closeChat = (index: number) => {
    if (user && chats.length){
      if(chats.length===1) setPopups({link: false, create: false, join: false, newChat: false});
      leaveChat(chats[index].sessionId, user.userId, chats[index].users);
      if(index<=openChat){
        setOpenChat(openChat==0? openChat : openChat-1);
      }
    }
  }

  const renderImage = (link: string | undefined, groupKey: CryptoKey | "pending" | undefined, iv: string | undefined) => {
    if(!link || !groupKey || !iv) return;
    const id = uuidv4();
    downloadFile(link, groupKey, iv, "image", id);
    return (<img id={id} className={main.responsiveImage} alt="message attachment"></img>)
  }

  return (
    <>
      {chats.length ? (
        <>
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
          <Chat
            user={user}
            chatId={chats[openChat].sessionId}
            showLink={() => setPopups({create: false, newChat: false, join: false, link: true})}
            setPopups={setPopups}
            chats={chats}
            openChat={openChat}
            setOpenChat={setOpenChat}
            closeChat={closeChat}
          >
            {chats[openChat].messages.map((message) => {
              return (
                <Message
                  isSender={message.sender.userId === user?.userId}
                  senderName={message.sender.username}
                >
                  {message.file? message.file?.type==="image" ?
                  (
                    renderImage(message.file?.link, user?.keys[chats[openChat].sessionId].groupKey, message.file.iv)
                  ) : (
                    <button onClick={() => {if(user) downloadFile(message.file?.link, user.keys[chats[openChat].sessionId].groupKey, message.file?.iv, "other")}}>Download {message.file?.link}</button>
                  ) : <></>}
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
          <div className={main.popupForm}>
            <div style={{display: 'flex'}}>
              <input type="text" style={{ padding: '12px', width: 'auto', flexGrow:'2'}} readOnly value={link} />
              <button className={buttonStyles.textContainer}
                type="button"
                onClick={() => navigator.clipboard.writeText(link)}
              >
                Copy Join Link
              </button>
            </div>
            <div style={{display: 'flex'}}>
              <input type="text" style={{ padding: '12px', width: 'auto', flexGrow:'2'}} readOnly value={chatId} />
              <button className={buttonStyles.textContainer}
                type="button"
                onClick={() => navigator.clipboard.writeText(chatId)}
              >
                Copy Chat ID
              </button>
            </div>
          </div>
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
            className={main.popupForm}
            onSubmit={createHandler}
          >
            <div className={main.formField}>
              <label htmlFor="chatName" style={{ fontSize: '22px'}}>Chat Name</label>
              <input required type="text" style={{ padding: '12px'}} name="chatName"/>
            </div>
            <div className={main.formField}>
              <label htmlFor="displayName" style={{ fontSize: '22px'}}>Display Name</label>
              <input required style={{ padding: '12px' }}
                type="text"
                defaultValue={user?.username || ""}
                name="displayName"
              />
            </div>
            <div className={main.formField}>
              <label htmlFor="securityQuestion" style={{ fontSize: '22px'}}>Security Question</label>
              <input style={{ padding: '12px' }}
                type="text"
                name="securityQuestion"
                required
              />
            </div>
            <div className={main.formField}>
              <label htmlFor="securityAnswer" style={{ fontSize: '22px'}}>Answer</label>
              <input style={{ padding: '12px' }}
                type="text"
                name="securityAnswer"
                required
              />
            </div>
            <button type="submit" className={mainStyles.textContainer}>Create</button>
          </form>
        </Popup>
      ) : (
        <></>
      )}
      {popups.join ? (
        <Popup
          title="Join a chat"
          closeFn={() => {
            setPopups({
              link: false,
              create: false,
              join: false,
              newChat: false,
            })
            setValError(false);
            setQuestion(undefined);
          }}
        >
          <form
            className={main.popupForm}
            onSubmit={question? joinHandler : fetchHandler}
          >
            <div className={main.formField}>
              <label htmlFor="chatId" style={{ fontSize: '22px', textAlign: "left" }}>Chat ID</label>
              <input type="text" defaultValue={code || "" } style={{ padding: '12px'}} name="chatId" required/>
            </div>
            <div className={main.formField}>
              <label htmlFor="displayName" style={{ fontSize: '22px', textAlign: "left"}}>Display Name</label>
              <input style={{ padding: '12px'}}
                type="text"
                defaultValue={user?.username || ""}
                name="displayName"
                required
              />
            </div>
            <div className={`${main.formField} ${question? "": main.hidden}`}>
              <label htmlFor="securityAnswer" style={{ fontSize: '22px', textAlign: "left"}}>{"Security Question: " + question || ""}</label>
              <input style={{ padding: '12px'}}
                type="text"
                name="securityAnswer"
                required={question!==undefined}
              />
            </div>
            <p className={`${!valError? main.hidden : ""}`}>{question? "Incorrect security answer" : "Chat with specified ID not found"}</p>
            <button type="submit" className={mainStyles.textContainer}>{question? "Join" : "Next"}</button>
          </form>
        </Popup>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
