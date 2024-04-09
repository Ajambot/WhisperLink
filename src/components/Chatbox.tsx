import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { sendMessage } from "../handlers";
import { user } from "../types";
import "../Global.module.css";
import InputStyles from "./Chat.module.css"

interface Props {
  chatId: string;
  user: user | undefined
  showLink: () => void;
}

const Chatbox = ({ user, chatId, showLink }: Props) => {
  const [msg, setMsg] = useState<string>("");
  const [file, setFile] = useState<File>();

   const triggerFileInput = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput?.click();
  };

  return (
    <form
      className={InputStyles.chatboxContainer}
      onSubmit={(e) => {
        e.preventDefault();
        if(!user) return
        sendMessage(chatId, user, msg, file, );
        setMsg("");
        setFile(undefined);
        e.currentTarget.reset();
      }}
    >
      <input className={InputStyles.inputText}
        type="text"
        placeholder="Type a message"
        name="message text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      ></input>
      <input
        id='fileInput'
        type="file"
        className={InputStyles.fileInput}
        onChange={(e) => {
          if (!e.target.files) return;
          const file = e.target.files[0];
          setFile(file);
        }}
      />
      <button type='button' className={InputStyles.iconButton} onClick={triggerFileInput}>
      <FontAwesomeIcon icon={faPaperclip} />
      </button>
      <button className={InputStyles.iconButton} type="submit">
      <FontAwesomeIcon icon={faPaperPlane} />
       </button>
      <button type="button" className={InputStyles.iconButton} onClick={showLink}><FontAwesomeIcon icon={faUserPlus} /></button>
    </form>
  );
};

export default Chatbox;