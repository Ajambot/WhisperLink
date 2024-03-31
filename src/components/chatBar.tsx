import React from "react";
import styles from "./ChatBar.module.css";
import Styles from "./addCloseChat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
  chats: Array<{ chatName: string }>;
  openChat: number;
  setOpenChat: (index: number) => void;
  leaveChat: (index: number) => void;
  setPopups: (popups: {
    create: boolean;
    join: boolean;
    link: boolean;
    newChat: boolean;
  }) => void;
}

const ChatBar = ({
  chats,
  openChat,
  setOpenChat,
  leaveChat,
  setPopups,
}: Props) => {
  return (
    <div className={styles.chatNavBar}>
      {chats.map((chat, index) => (
        <button
          key={index}
          className={`${styles.textContainer} ${
            openChat === index ? styles.active : ""
          }`}
          onClick={() => setOpenChat(index)}
        >
          {chat.chatName}
          <button
            className={Styles.textContainer}
            onClick={(e) => {
              e.stopPropagation();
              leaveChat(index);
            }}
            type="button"
            aria-label="close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </button>
      ))}
      <button
        className={Styles.textContainer}
        onClick={() =>
          setPopups({ create: false, join: false, link: false, newChat: true })
        }
        type="button"
        aria-label="add"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default ChatBar;
