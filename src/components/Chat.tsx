import React, { useState } from "react";
import Chatbox from "./Chatbox";

interface Props {
  children: React.ReactNode;
  chatId: number; // Adding chatId to the props
  onClose: (chatId: number) => void; // Function to call when closing the chat
}

const Chat = ({ children, chatId, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="chat-header">
        <a href="#">Chat ID: {chatId}</a> {/* Displaying the Chat ID */}
        <button 
          type="button" 
          className="chat-close" 
          aria-label="close"
          onClick={() => onClose(chatId)} // Using onClose with chatId to close this specific chat
        >
          Close chat
        </button>
      </div>
      <div className="chatroom-main">{children}</div>
      {/* You might need to pass chatId to Chatbox if it needs to know which chat it is part of */}
      <Chatbox chatId={chatId} />
    </>
  );
};

export default Chat;
