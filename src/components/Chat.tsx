import React from "react";
import Chatbox from "./Chatbox";
import { user } from "../types";
import Styles from "../buttonText.module.css"
import textStyles from "./Popup.module.css"

interface Props {
  children: React.ReactNode;
  chatId: string;
  user: user | undefined;
  showLink: () => void
}

const Chat = ({ user, children, chatId, showLink }: Props) => {
  return (
    <div>
      <div className="chatroom-main">{children}</div>
      <Chatbox user={user} chatId={chatId} />
      <button className={Styles.textContainer} type="button" onClick={showLink}>Invite People</button>
    </div>
  );
};

export default Chat;