import React from "react";
import Chatbox from "./Chatbox";
import { user } from "../types";
import Styles from "../buttonText.module.css"

interface Props {
  children: React.ReactNode;
  chatId: string;
  user: user | undefined;
  leaveChat: () => void
}

const Chat = ({ user, children, chatId, leaveChat }: Props) => {
  return (
    <div>
      <div className="chat-header">
        <button className={Styles.textContainer}
          onClick={leaveChat}
          type="button"
          aria-label="close"
        >
          Close chat
        </button>
      </div>
      <div className="chatroom-main">{children}</div>
      <Chatbox user={user} chatId={chatId} />
    </div>
  );
};

export default Chat;