import React from "react";
import Chatbox from "./Chatbox";
import { user } from "../types";

interface Props {
  children: React.ReactNode;
  chatId: string;
  user: user | undefined;
  showLink: () => void
}

const Chat = ({ user, children, chatId, showLink }: Props) => {
  return (
    <div>
      <div className="chat-header">
        <button type="button" onClick={showLink}>Invite People</button>
      </div>
      <div className="chatroom-main">{children}</div>
      <Chatbox user={user} chatId={chatId} />
    </div>
  );
};

export default Chat;