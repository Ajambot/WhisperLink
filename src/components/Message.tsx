import React from "react";

interface Props {
  senderName: string;
  children: React.ReactNode;
}

const Message = ({ children, senderName }: Props) => {
  return (
    <div>
      <h1>{senderName}</h1>
      <p>{children}</p>
    </div>
  );
};

export default Message;
