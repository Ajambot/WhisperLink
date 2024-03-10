import { useEffect, useState } from 'react'
import Message from './components/Message';
import Chat from './components/Chat';
import { addMessageListener } from './handlers';
import type { message } from './types';

function App() {
  const [messages, setMessages] = useState<message[]>([]);
  useEffect(() => {
    const unsub = addMessageListener(setMessages);
    return () => unsub();
  }, [])

  return (
    <>
      <Chat>
        {messages.map((message)=>{
            return <Message senderName={message.senderName}>{message.text}</Message>
        })}
      </Chat>
    </>
  )
}

export default App
