import React, { useEffect, useRef } from "react";
import Chatbox from "./Chatbox";
import { user } from "../types";
import ChatBar from "./ChatBar"
import Styles from "./Chat.module.css"
import "../Global.module.css";

interface Props {
  children: React.ReactNode;
  chats: Array<{ chatName: string }>;
  openChat: number;
  chatId: string;
  user: user | undefined;
  setOpenChat: (index: number) => void;
  closeChat: (index: number) => void;
  showLink: () => void;
  setPopups: (popups: {
    create: boolean;
    join: boolean;
    link: boolean;
    newChat: boolean;
  }) => void;
}


  

const Chat = ({ user, children, chatId, showLink, chats, openChat, setOpenChat, closeChat, setPopups}: Props) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [children]); 

  return (
    <>
      <div className={Styles.chatNavBar}>
      <ChatBar chats={chats} openChat={openChat} setOpenChat={setOpenChat} leaveChat={closeChat}  setPopups={setPopups}/>        
      </div>
      <div className={Styles.textBodyContainer}> {children} <div ref={endOfMessagesRef} /></div>
      <Chatbox user={user} chatId={chatId} showLink={showLink} />
      </>
  );
};

export default Chat;