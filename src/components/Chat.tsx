import React, { useState } from "react";
import Chatbox from "./Chatbox";

interface Props {
    children: React.ReactNode;
    chatId: number; // Adding chatId to the props
    onClose: (chatId: number) => void; // Function to call when closing the chat
}

const Chat = ({ children, chatId, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    onClose(chatId);
    setIsOpen(false); // if managing open/close state within component
  };

  return isOpen ? (
    <>
      <div className="chat-header">
        <button 
          type="button" 
          className="chat-close" 
          aria-label="close"
          onClick = {handleClose} // Using onClose with chatId to close this specific chat
        >
          Close chat
        </button>
      </div>
      <div className="chatroom-main">{children}</div>
      <Chatbox chatId={chatId} />
    </>
  ): null;
};

export default Chat;

