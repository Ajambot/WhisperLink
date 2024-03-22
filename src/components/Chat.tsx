import React from "react";
import Chatbox from "./Chatbox";

interface Props {
  children: React.ReactNode;
  chatId: string;
}

const Chat = ({ children, chatId }: Props) => {
  return (
    <div>
      <div className="chat-header">
        <a href="#">Chat ID</a>
        <button type="button" className="chat-close" aria-label="close">
          Close chat
        </button>
      </div>
      <div className="chatroom-main">{children}</div>
      <Chatbox chatId={chatId} />
    </div>
  );
};

export default Chat;
