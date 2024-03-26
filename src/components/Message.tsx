import React from "react";
import styles from "./Message.module.css"; // Assuming this is the path to your CSS module

interface MessageProps {
  senderName: string;
  children: React.ReactNode;
  isSender?: boolean; // Make isSender optional if not all parent components will pass it
}

const Message = ({ children, senderName, isSender }: MessageProps) => {
  return (
    <div className={styles.messageContainer}>
      <div className={isSender ? styles.sentMessage : styles.receivedMessage}>
        <div className={styles.senderName}>{senderName}</div>
        <p>{children}</p>
      </div>
    </div>
  );
};

export default Message;
