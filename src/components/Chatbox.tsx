import { useState } from 'react'
import { sendMessage } from '../handlers'

interface ChatboxProps {
  chatId: number; 
}
const Chatbox = ({ chatId }: ChatboxProps) => {
    const [ msg, setMsg ] = useState<string>("")
    const [ file, setFile ] = useState<File | undefined>()
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (msg.trim() !== "" || file) {
          sendMessage(chatId, msg.trim(), file);
          setMsg("");
          setFile(undefined);
      }
  };
  
  return (
    <form className="chatroom-chatbox" onSubmit={handleSubmit}>
        <input type="text" placeholder='Type a message' className="chatbox-input" name="message text" value={msg} onChange={e => setMsg(e.target.value)}></input>
        <input type="file" onChange={(e)=> {
          if(!e.target.files) return
          const file = e.target.files[0]
          setFile(file)
        }}/>
        <button className='btn-send' type='submit' >Send Message</button>
    </form>
  )
}

export default Chatbox