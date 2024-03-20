import { useState } from "react";
import { sendMessage } from "../handlers";

const Chatbox = () => {
  const [msg, setMsg] = useState<string>("");
  const [file, setFile] = useState<File>();
  return (
    <form
      className="chatroom-chatbox"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(msg, file);
        setMsg("");
        setFile(undefined);
        e.currentTarget.reset();
      }}
    >
      <input
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
      <button className="btn-send" type="submit">
        Send Message
      </button>
    </form>
  );
};

export default Chatbox;
