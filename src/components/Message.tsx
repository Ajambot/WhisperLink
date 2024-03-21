import React from "react";

interface Props {
  senderName: string;
  children: React.ReactNode;
  chatId: number;
}

const Message = ({ children, senderName, chatId }: Props) => {
  return (
    <div className={`message ${chatId ? "chat-specific" : ""}`}>
      {chatId && <div className="chat-id">Chat ID: {chatId}</div>}
      <h1>{senderName}</h1>
      <p>{children}</p>
    </div>
  );
};

export default Message;
