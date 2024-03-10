import { useState } from 'react'
import { sendMessage } from '../handlers'

const Chatbox = () => {
    const [ msg, setMsg ] = useState<string>("")
  return (
    <div className="chatroom-chatbox">
        <input type="text" placeholder='Type a message' className="chatbox-input" name="message text" value={msg} onChange={e => setMsg(e.target.value)}></input>
        <button className="btn-attach" type='button' aria-label='attach files'>Attach File/Image</button>
        <button className='btn-send' type='submit' onClick={() => sendMessage(msg)}>Send Message</button>
    </div>
  )
}

export default Chatbox