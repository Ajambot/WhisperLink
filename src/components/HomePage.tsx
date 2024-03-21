import React from 'react';
import ChatIdGen from './ChatIdGenerator';


interface HomePageProps {
    onJoin: () => void; 
    onCreate: (chatId: number) => void; 
}

const HomePage: React.FC<HomePageProps> = ({onJoin, onCreate }) => {
    const handleCreate = () => {
        const newChatId = ChatIdGen(); //Placeholder for new chatId will need to change
        onCreate(newChatId);
    };
    return (
        <div className="home">
            <h1>Welcome to WhisperLink</h1>
            <div className="buttons">
                <button onClick={onJoin}>Join a Chatroom</button>
                <button onClick={onCreate}>Create a Chatroom</button>
            </div>
        </div>
    );
};

export default HomePage;
