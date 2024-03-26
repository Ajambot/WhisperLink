import React from 'react';
import styles from './ChatBar.module.css';
import Styles from "./addCloseChat.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";


// Props definition
interface ChatBarProps {
  chats: Array<{ chatName: string }>; // Assuming each chat has at least a 'chatName'
  openChat: number; // The index of the currently open chat
  setOpenChat: (index: number) => void; // Function to set the open chat
  leaveChat: () => void;
  addNewChat?:() => void;
  setPopups: (popups: { create: boolean; join: boolean; link: boolean; newChat: boolean }) => void; 
}


const ChatBar: React.FC<ChatBarProps> = ({ chats, openChat, setOpenChat, leaveChat, setPopups}) => {
  return (
    <div className={styles.chatNavBar}>
      {chats.map((chat, index) => (
        <button
          key={index}
          className={`${styles.textContainer} ${openChat === index ? styles.active : ''}`}
          onClick={() => setOpenChat(index)}
        >
          {chat.chatName}
          <button className={Styles.textContainer}
          onClick={leaveChat}
          type="button"
          aria-label="close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        </button>
      ))}
      <button className={Styles.textContainer} onClick={() => setPopups({ create: false, join: false, link: false, newChat: true })}
          type="button"
          aria-label="add">
              <FontAwesomeIcon icon={faPlus} />
            </button>
    </div>
  );
};

export default ChatBar;
