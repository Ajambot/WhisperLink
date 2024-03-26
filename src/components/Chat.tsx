import React from "react";
import Chatbox from "./Chatbox";
import { user } from "../types";
import Styles from "../buttonText.module.css"

interface Props {
  children: React.ReactNode;
  chatId: string;
  user: user | undefined
}

const Chat = ({ user, children, chatId }: Props) => {
  return (
    <div>
      <div className="chat-header">
        <a href="#">Chat ID</a>
        <button className={Styles.textContainer} type="button" aria-label="close">
          Close chat
        </button>
      </div>
      <div className="chatroom-main">{children}</div>
      <Chatbox user={user} chatId={chatId} />
    </div>
  );
};

export default Chat;