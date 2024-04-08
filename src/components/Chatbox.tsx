import { useState } from "react";
import { sendMessage } from "../handlers";
import { user } from "../types";
import "../Global.module.css";
import Styles from "../buttonText.module.css"

interface Props {
  chatId: string;
  user: user | undefined
}

const Chatbox = ({ user, chatId }: Props) => {
  const [msg, setMsg] = useState<string>("");
  const [file, setFile] = useState<File>();

  return (
    <form
      className="chat-chatbox"
      onSubmit={(e) => {
        e.preventDefault();
        if(!user) return
        sendMessage(chatId, user, msg, file, );
        setMsg("");
        setFile(undefined);
        e.currentTarget.reset();
      }}
    >
      <input style={{fontSize: '20px', fontFamily: 'Oswald'}}
        type="text"
        placeholder="Type a message"
        className="chatbox-input"
        name="message text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      ></input>
      <input
        type="file"
        onChange={(e) => {
          if (!e.target.files) return;
          const file = e.target.files[0];
          setFile(file);
        }}
      />
      <button className={Styles.textContainer} type="submit">
        Send Message
      </button>
    </form>
  );
};

export default Chatbox;