import React from 'react';
import ChatIdGen from './ChatIdGenerator';


interface HomePageProps {
    onJoin: (chatId: number) => void; 
    onCreate: (chatId: number) => void; 
}

const HomePage: React.FC<HomePageProps> = ({onJoin, onCreate }) => {
    const handleCreate = () => {
        const newChatId = ChatIdGen(); //Placeholder for new chatId will need to change
        onCreate(newChatId);
    };

    const handleJoin = () => {
        onJoin(ChatIdGen()); // Modify as needed, e.g., onJoin(predefinedChatId);
    };

    return (
        <div className="home">
            <h1>Welcome to WhisperLink</h1>
            <div className="buttons">
                <button onClick={handleCreate}>Join a Chatroom</button>
                <button onClick={handleJoin}>Create a Chatroom</button>
            </div>
        </div>
    );
};

export default HomePage;
