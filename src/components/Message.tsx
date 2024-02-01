import React from 'react'

interface Props {
    text: string;
    senderName: string;
}

const Message = ({text, senderName}: Props) => {
  return (
    <div>
        <h1>{senderName}</h1>
        <p>{text}</p>
    </div>
  )
}

export default Message