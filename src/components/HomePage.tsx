import React from "react";

interface HomePageProps {
  onJoin: () => void;
  onCreate: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onJoin, onCreate }) => {
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
