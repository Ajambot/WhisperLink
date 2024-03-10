import React from 'react'
import Chatbox from './Chatbox'

interface Props {
    children: React.ReactNode;
}

const Chat = ({ children }: Props) => {
  return (
    <div>
        <div className='chat-header'>
            <a href="#">Chat ID</a>
            <button type='button' className='chat-close' aria-label='close'>Close chat</button>
        </div>
        <div className='chatroom-main'>
            {children}
        </div>
        <Chatbox/>
    </div>
  )
}

export default Chat